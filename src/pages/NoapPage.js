import logo from "../logo.svg";
import "../App.css";
import { Row, Col, Alert, Modal, Spinner, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, { Component, useState } from "react";
import NOAPCard from "../Cards/NOAPCard";
import poapcontract from "../utils/poapcontract.js";
import noapcontract from "../utils/noapcontract.js";

class NoapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedAddress: "Wallet not Connected!",
      connectedAddressStatus: "warning",
      Noaps: [],
      noapCount: 0,
      renderCards: false,
      pageCount: 0,
      querized: false,
      noInPage: 10,
      countAlert: false,
      account: "",
      loading: false,
    };
  }
  componentDidMount() { }

  CreateEvent = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    this.account = accounts[0]; //TODO change back to accounts[0]; // TEST with "0x90371fc9837c44d3fe17a9be68696fde51fcc011"
    this.setState({
      connectedAddressStatus: "primary",
      connectedAddress: this.account,
    });

    var uri = "https://shiryakhat.net/astronauts/0000.json";
    var gasAmount = await noapcontract.methods
      .createEvent(uri)
      .estimateGas({ from: this.account });

    var result = await noapcontract.methods.createEvent(uri).send({
      from: this.account,
      gasAmount,
    });
  }
  Mint = async (t) => {
    t.preventDefault();
    console.log("MintPOAP");
    const accounts = await window.ethereum.enable();
    this.account = accounts[0]; //TODO change back to accounts[0]; // TEST with "0x90371fc9837c44d3fe17a9be68696fde51fcc011"
    this.setState({
      connectedAddressStatus: "primary",
      connectedAddress: this.account,
    });

    // await window.ethereum.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: "0x64" }], // chainId must be in hexadecimal numbers
    // });
    var gasAmount = await poapcontract.methods
      .mintEventToManyUsers(1, [this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account])
      .estimateGas({ from: this.account });

    var result = await poapcontract.methods.mintEventToManyUsers(1, [this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account, this.account]).send({
      from: this.account,
      gasAmount,
    });

    console.log("result");
    console.log(result);
  };

  fetchData = async (t) => {
    t.preventDefault();
    console.log("fetchData");
    this.setState({ Noaps: [] });
    this.setState({ loading: true });
    console.log(window.ethereum);
    const accounts = await window.ethereum.enable();
    this.account = accounts[0]; //TODO change back to accounts[0]; // TEST with "0x90371fc9837c44d3fe17a9be68696fde51fcc011"
    this.setState({
      connectedAddressStatus: "primary",
      connectedAddress: this.account,
    });

    // await window.ethereum.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: "0x64" }], // chainId must be in hexadecimal numbers
    // });
    var gasAmount = await noapcontract.methods
      .balanceOf(this.account)
      .estimateGas({ from: this.account });

    var noapCount = await noapcontract.methods.balanceOf(this.account).call({
      from: this.account,
      gasAmount,
    });

    console.log("noapCount");
    console.log(noapCount);
    this.setState({ pageCount: noapCount / this.state.noInPage + 1 });
    this.setState({ noapCount: noapCount });
    //if (this.state.pageCount >= 1) {
    //  this.setState({ querized: true });
    //}
    //

    await this.fetchNoaps(0);

    this.setState({ renderCards: true });

    // for (var i = 1; i < this.state.pageCount; i++) {
    //   await this.fetchNoaps(i);
    //   this.setState({ renderCards: true });
    // }
    // this.setState({ loading: false });
    // console.log(this.state.Noaps);
  };

  fetchNoaps = async (pageCount) => {
    //t.preventDefault();
    //var results = [];
    var currMAx = this.state.noInPage * pageCount + this.state.noInPage;
    var max = currMAx < this.state.noapCount ? currMAx : this.state.noapCount;

    for (var i = this.state.noInPage * pageCount; i < max; i++) {
      var NoapId = await this.fetchNoap(i);
      var result = await this.fetchNoapsURI(NoapId);
      await fetch(result)
        .then((res) => res.json())
        .then((result) => {
          console.log(i);
          var resObj = result;
          resObj.tokenId = NoapId;
          this.state.Noaps.push(resObj);
          console.log("resObj");
          console.log(resObj);
        });
    }
  };

  fetchNoap = async (i) => {
    var gasAmount = await noapcontract.methods
      .tokenOfOwnerByIndex(this.account, i)
      .estimateGas({ from: this.account });
    var Noap = await noapcontract.methods
      .tokenOfOwnerByIndex(this.account, i)
      .call({
        from: this.account,
        gasAmount,
      });
      console.log(Noap);
    return Noap;
  };
  fetchNoapsURI = async (tokenId) => {
    var gasAmount = await noapcontract.methods
      .tokenURI(tokenId)
      .estimateGas({ from: this.account });
    var NoapURI = await noapcontract.methods.tokenURI(tokenId).call({
      from: this.account,
      gasAmount,
    });
    return NoapURI;
  };
  render() {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <h2> 💩🔥🎉 </h2>
            <h3> POⒶP Burning Ceremony </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Alert variant={this.state.connectedAddressStatus}>
              {this.state.connectedAddress}
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col md={6} style={{ paddingBottom: "10px" }}>
            <Button
              className="glitch"
              onClick={this.Mint}
              disabled={this.state.loading}
            >
              Mint Poap
            </Button>{" "}
            {"   "}
          </Col>
          <Col md={6} style={{ paddingBottom: "10px" }}>
            <Button
              className="glitch"
              onClick={this.CreateEvent}
              disabled={this.state.loading}
            >
              Create Event
            </Button>{" "}
            {"   "}
          </Col>
          <Col md={6} style={{ paddingBottom: "10px" }}>
            <Button
              className="glitch"
              onClick={this.fetchData}
              disabled={this.state.loading}
            >
              fetchData
            </Button>{" "}
            {"   "}
          </Col>
          {/* <Col md={6}>
            <Button className="glitch" onClick={this.burn}>
              Burn 💩 and 🚀{" "}
            </Button>
          </Col> */}
        </Row>
        <Row xs={2} md={2} lg={5}>
          {Array.from(this.state.Noaps).map((Noap, idx) => (
            <NOAPCard Noap={Noap} key={Noap.tokenId} />
          ))}
        </Row>
        
      </Container>
    );
  }
}

export default NoapPage;
