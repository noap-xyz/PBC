import React from "react";
import { useState, useEffect } from "react";
import { Form,Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import NOAP from "../../contracts/NOAP.json";
import {useNavigate} from 'react-router'
import { useContract } from "../../hooks/useContract";
import "./CreateEventForm.css";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-country-region-selector";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const GAS_AMOUNT = 3000000;

function CreateEventForm() {
  const { account } =
    useWeb3React();
  let [loading, setLoading] = useState(false);
 
  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [email,setEmail] = useState("")
  const [date,setDate] = useState("")
  const [jsonFile,setJsonFile] = useState("")
  const [url, setUrl] = useState("");
  const [country,setCountry] = useState("")
  const [city,setCity] = useState("")
  const [online,setOnline] = useState(false)

  const contract = useContract(NOAP);
  const navigate = useNavigate()
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    
    
       const data =  await uploadFile();
        if(data === true) {
          setLoading(true);
          try {
            const eventId = await contract.contract.methods
              .createEvent(
                url,
                description,
                name,
                country,
                city,
                online,
                date,
                email
              )
              .send({ from: account, gas: GAS_AMOUNT });
          return navigate("/events");

          } catch(err) {
            console.log(err)
            NotificationManager.warning(
              "Semething went wrong",
            );
          }

          setLoading(false)
        }
   
    
  };


  const uploadFile =async () => {
    
      const data = new FormData();
      data.append("file", jsonFile);
      data.append("upload_preset", "noapweb3");
      data.append("cloud_name", "noap");
      const resp = await fetch(
        " https://api.cloudinary.com/v1_1/noap/auto/upload",
        {
          method: "post",
          mode: "cors",
          body: data,
        }
      );
      if(resp.status === 400) {
        NotificationManager.warning("Semething went wrong");
        return false;
      } else {
        let json = await resp.json();
        setUrl(json.url)
        NotificationManager.success("File well deployed");
        return true;
      }
    
    }
   



  return (
    <div>
      <NotificationContainer />
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="formLable">Event Description</Form.Label>
          <Form.Control
            name="description"
            required
            as="textarea"
            rows={3}
            placeholder="Give a clear description about your NOAP event. This description will be published with your event for collectors and issuers to see."
            className="formBox"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="formItems">
          <Form.Group className="mb-3 rightItem" controlId="email">
            <Form.Label className="formLable">Email</Form.Label>
            <Form.Control
              name="email"
              required
              type="email"
              placeholder="name@example.com"
              className="formBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 leftItem " controlId="location">
            <Form.Label className="formLable">Location</Form.Label>
            <div className="d-flex">
              <CountryDropdown
                className="location-input"
                value={country}
                onChange={(val) => setCountry(val)}
                style={{ marginRight: "10px" }}
              />
              <RegionDropdown
                className="location-input"
                country={country}
                value={city}
                onChange={(e) => setCity(e)}
              />
            </div>
          </Form.Group>
        </div>

        <div className="formItems">
          <Form.Group className="mb-3 rightItem" controlId="date">
            <Form.Label className="formLable">Date</Form.Label>
            <Form.Control
              name="date"
              required
              type="date"
              placeholder="DD/MM/YYYY"
              className="formBox"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 leftItem" controlId="name">
            <Form.Label className="formLable">Event Name</Form.Label>
            <Form.Control
              name="eventName"
              required
              type=""
              placeholder="enter the name of your NOAP event"
              className="formBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </div>

        <Form.Group controlId="formFile" className="mb-3 formFile">
          <Form.Label>NOAP Artwork</Form.Label>
          <Form.Control
            name="jsonFile"
            type="file"
            accept="application/json"
            className="formBox"
            value={""}
            onChange={(e) => setJsonFile(e.target.files[0])}
          />
        </Form.Group>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Online Event"
          value={online}
          onChange={(e) => setOnline(e.target.checked)}
        />
      </Form>
      <Button onClick={handleSubmit} className="submit" disabled={loading}>
        {loading ? "Creating..." : "Create event"}
      </Button>
    </div>
  );
}

export default CreateEventForm;
