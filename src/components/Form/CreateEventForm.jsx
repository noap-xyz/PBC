import React from "react";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import NOAP from "../../contracts/NOAP.json";
import { useNavigate } from "react-router";
import { useContract } from "../../hooks/useContract";
import "./CreateEventForm.css";
import axios from "axios";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import ShareModal from "../modals/ShareModal";
import { useForm } from "react-hook-form";

const GAS_AMOUNT = 3000000;

function CreateEventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const { account } = useWeb3React();

  const [url, setURl] = useState("");
  let [loading, setLoading] = useState(false);
  const [startDate,setStartDate] = useState("")

  
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [fileImg, setFileImg] = useState(null);

  const contract = useContract(NOAP);
  const navigate = useNavigate();

  function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
  }

  
  

  //modal part
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    return navigate(`/${url}`);
  };

  const handleShow = () => setShow(true);

  const onSubmit = async (data) => {
    //some validation by react useForm hook
     setLoading(true);
    
    
    //process of uploading the image and the metadata
    try {
      const url = await sendFileToIPFS();
      const tokenURI = await uploadJson(url);

      await contract?.contract?.methods
        ?.createEvent(
          tokenURI,
          getValues("description"),
          getValues("name"),
          country,
          city,
          getValues("online"),
          toTimestamp(getValues("startDate")),
          toTimestamp(getValues("endDate")),
          getValues("email"),
          getValues("supply")
        )
        .send({ from: account, gas: GAS_AMOUNT });
      const eventId = await contract?.contract?.methods.getLastEventID().call();
      setURl(`events/${eventId}`);
      handleShow(true);
      setCity("");
      setCountry("");
      setFileImg(null);
    } catch (err) {
      console.log(err);
      NotificationManager.warning("Something went wrong");
    }

    setLoading(false);
  };

  const uploadJson = async (url) => {
    //make metadata
    const metadata = new Object();
    metadata.name = getValues("name");
    metadata.image = url;
    metadata.description = getValues("description");

    //make pinata call
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      NotificationManager.warning(
        "😢 Something went wrong while uploading your tokenURI."
      );
      return;
    }
    const tokenURI = pinataResponse.pinataUrl;
    return tokenURI;
  };

  const pinJSONToIPFS = async (jsonBody) => {
    const url = process.env.REACT_APP_URL_JSON;
    //making axios POST request to Pinata ⬇️
    return axios
      .post(url, jsonBody, {
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
        },
      })
      .then(function(response) {
        return {
          success: true,
          pinataUrl:
            "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        };
      })
      .catch(function(error) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  };

  const sendFileToIPFS = async () => {
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: process.env.REACT_APP_URL_FILE,
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
            "Content-Type": "multipart/form-data",
          },
        });

        const url = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        return url;
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
      } catch (error) {
        NotificationManager.warning("Error sending File to IPFS: ");
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    } else {
      NotificationManager.error("Please choose a file");
    }
  };

  return (
    <div>
      <NotificationContainer />
      <ShareModal url={url} show={show} handleClose={handleClose} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="formLable">Event Description</Form.Label>
          <Form.Control
            name="description"
            as="textarea"
            rows={3}
            placeholder="Give a clear description about your NOAP event. This description will be published with your event for collectors and issuers to see."
            className="formBox"
            {...register("description", { required: true, minLength: 30 })}
          />
        </Form.Group>
        {errors.description && (
          <p className="error">
            The minimum length of your description is 30 characters
          </p>
        )}
        <div className="formItems">
          <div className="item d-flex flex-column rightItem">
            <Form.Group
              className="mb-3 "
              controlId="email"
              style={{ width: "100%" }}
            >
              <Form.Label className="formLable">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="name@example.com"
                className="formBox"
                {...register("email", {
                  required: true,
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />
            </Form.Group>
            <div className="">
              {errors.email && <p className="error">Please check the Email</p>}
            </div>
          </div>

          <div className="item d-flex flex-column leftItem">
            <Form.Group className="mb-3 " controlId="location">
              <Form.Label className="formLable">Location</Form.Label>
              <div className="d-flex">
                <CountryDropdown
                  className="location-input"
                  value={country}
                  onChange={(val) => setCountry(val)}
                  required
                  style={{ marginRight: "10px" }}
                />
                <RegionDropdown
                  className="location-input"
                  country={country}
                  value={city}
                  required
                  onChange={(e) => setCity(e)}
                />
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="formItems">
          <div className="item d-flex flex-column rightItem">
            <Form.Group className="mb-3" controlId="startdate">
              <Form.Label className="formLable">Start Date</Form.Label>
              <Form.Control
                name="startdate"
                type="date"
                placeholder="DD/MM/YYYY"
                className="formBox"
                {...register("startDate", { required: true })}
                onChange={e=>setStartDate(e.target.value)}
              />
            </Form.Group>
            <div className="">
              {errors.startDate && (
                <p className="error">This field is required</p>
              )}
            </div>
          </div>

          <div className="item d-flex flex-column leftItem">
            <Form.Group className="mb-3 " controlId="enddate">
              <Form.Label className="formLable">End date</Form.Label>
              <Form.Control
                name="enddate"
                type="date"
                placeholder="DD/MM/YYYY"
                disabled={startDate===""}
                min={startDate}
                className="formBox"
                {...register("endDate", { required: true })}
              />
            </Form.Group>
            <div className="">
              {errors.endDate && (
                <p className="error">This field is required</p>
              )}
            </div>
          </div>
        </div>
        <div className="formItems">
          <div className="item d-flex flex-column rightItem">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="formLable">Event Name</Form.Label>
              <Form.Control
                name="eventName"
                type=""
                placeholder="enter the name of your NOAP event"
                className="formBox"
                {...register("name", { required: true, maxLength: 30 })}
              />
            </Form.Group>
            {errors.name && (
              <div className="">
                <p className="error">
                  The maximum length of the event's name is 30 characters
                </p>
              </div>
            )}
          </div>

          <Form.Group controlId="formFile" className="mb-3  leftItem">
            <Form.Label>NOAP Image</Form.Label>
            <Form.Control
              name="artwork"
              type="file"
              accept="application/jpeg application/png application/jpg"
              className="formBox hidden"
              onChange={(e) => setFileImg(e.target.files[0])}
            />
          </Form.Group>
        </div>
        <div className="formItems">
          <div className="item d-flex flex-column rightItem">
            <Form.Group controlId="supply" className="mb-3 ">
              <Form.Label>Total NOAPS To Mint</Form.Label>
              <Form.Control
                name="supply"
                type="number"
                className="formBox"
                {...register("supply", {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
              />
            </Form.Group>
            <div className="">
              {errors.supply && (
                <p className="error">The minimum number of noaps supply is 1</p>
              )}
            </div>
          </div>
          <div className="item d-flex flex-column leftItem">
            <Form.Group controlId="online" className="mb-3">
              <Form.Label></Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Online Event"
                {...register("online")}
              />
            </Form.Group>
            <div className="">
              {errors.online && <p className="error">This is required</p>}
            </div>
          </div>
        </div>
        {/* <Button className="submit" disabled={loading}>
          {loading ? "Creating..." : "Create event"}
        </Button> */}
        <Button type="submit" className="submit" disabled={loading}>
          {loading ? "Creating..." : "Create event"}
        </Button>
      </Form>
    </div>
  );
}

export default CreateEventForm;
