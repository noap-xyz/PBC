import web3 from "../utils/web3";
import "../App.css";
import { Row, Col, Alert, Modal, Spinner, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import React, { Component, useState } from "react";
import POAPCard from "../Cards/POAPCard";
import Pagination from "react-bootstrap/Pagination";
import poapcontract from "../utils/poapcontract.js";
import noapcontract from "../utils/noapcontract.js";
import contractAddresses from "../utils/contractAddresses.js"

class PoapBurnPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedAddress: "Wallet not Connected!",
      connectedAddressStatus: "warning",
      Poaps: [],
      PoapCount: 0,
      renderCards: false,
      PoapsToBurn: [],
      pageCount: 0,
      querized: false,
      noInPage: 10,
      countAlert: false,
      account: "",
      loading: false,
      contracts: [
        contractAddresses.poapContractAddress,
        contractAddresses.poapContractAddress,
        contractAddresses.poapContractAddress,
        contractAddresses.poapContractAddress,
        contractAddresses.poapContractAddress
      ]
    };

  }
  componentDidMount() { }

  fetchData = async (t) => {
    t.preventDefault();
    console.log("fetchData");
    this.setState({ Poaps: [] });
    this.setState({ loading: true });
    console.log(window.ethereum);
    const accounts = await window.ethereum.enable();
    this.account = accounts[0]; //TODO change back to accounts[0]; // TEST with "0x90371fc9837c44d3fe17a9be68696fde51fcc011"
    this.setState({
      connectedAddressStatus: "primary",
      connectedAddress: this.account,
    });
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{ chainId: "0x64" ,chainName:"Gnosis Chain",rpcUrls:["https://rpc.gnosischain.com/"]}], // chainId must be in hexadecimal numbers
    });

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x64" }], // chainId must be in hexadecimal numbers
    });


    var gasAmount = await poapcontract.methods
      .balanceOf(this.account)
      .estimateGas({ from: this.account });

    var poapCount = await poapcontract.methods.balanceOf(this.account).call({
      from: this.account,
      gasAmount,
    });

    console.log("poapCount");
    console.log(poapCount);
    this.setState({ pageCount: poapCount / this.state.noInPage + 1 });
    this.setState({ poapCount: poapCount });
    //if (this.state.pageCount >= 1) {
    //  this.setState({ querized: true });
    //}
    //

    await this.fetchPoaps(0);

    this.setState({ renderCards: true });

    for (var i = 1; i < this.state.pageCount; i++) {
      await this.fetchPoaps(i);
      this.setState({ renderCards: true });
    }
    this.setState({ loading: false });
  };

  fetchPoaps = async (pageCount) => {
    //t.preventDefault();
    //var results = [];
    var currMAx = this.state.noInPage * pageCount + this.state.noInPage;
    var max = currMAx < this.state.poapCount ? currMAx : this.state.poapCount;

    for (var i = this.state.noInPage * pageCount; i < max; i++) {
      var Poap = await this.fetchPoap(i);
      var result = await this.fetchPoapsURI(Poap.tokenId);
      await fetch(result)
        .then((res) => res.json())
        .then((result) => {
      console.log(i);
      var resObj = result;
      resObj.tokenId = Poap.tokenId;
      this.state.Poaps.push(resObj);
      console.log("resObj");
      console.log(resObj);
      });
    }
  };

  fetchPoap = async (i) => {
    var gasAmount = await poapcontract.methods
      .tokenDetailsOfOwnerByIndex(this.account, i)
      .estimateGas({ from: this.account });
    var Poap = await poapcontract.methods
      .tokenDetailsOfOwnerByIndex(this.account, i)
      .call({
        from: this.account,
        gasAmount,
      });
    return Poap;
  };
  fetchPoapsURI = async (tokenId) => {
    var gasAmount = await poapcontract.methods
      .tokenURI(tokenId)
      .estimateGas({ from: this.account });
    var PoapURI = await poapcontract.methods.tokenURI(tokenId).call({
      from: this.account,
      gasAmount,
    });
    return PoapURI;
  };

  burn = async (t) => {
    t.preventDefault();
    //console.log("this.account");
    //console.log(this.account);
    var uri = "https://shiryakhat.net/astronauts/0000.json";
    if (this.state.PoapsToBurn.length == 5) {
      /////////////////////////////////////////////Approve
      var approved = await poapcontract.methods
        .isApprovedForAll(this.account, contractAddresses.noapContractAddress)
        .call({
          from: this.account
        });
      if (!approved) {
        console.log("Not Approved");
        var gasAmount = await poapcontract.methods
          .setApprovalForAll(contractAddresses.noapContractAddress, true)
          .estimateGas({ from: this.account });
        var result = await poapcontract.methods
          .setApprovalForAll(contractAddresses.noapContractAddress, true)
          .send({
            from: this.account,
            gasAmount,
          });
      }
      ///////////////////////////////////////////Burn

      var gasAmount = await noapcontract.methods
        .burnAndRemintBatchDenver(this.state.contracts, [
          this.state.PoapsToBurn[0],
          this.state.PoapsToBurn[1],
          this.state.PoapsToBurn[2],
          this.state.PoapsToBurn[3],
          this.state.PoapsToBurn[4],
        ], uri)
        .estimateGas({ from: this.account });
      var result = await noapcontract.methods
        .burnAndRemintBatchDenver(this.state.contracts, [
          this.state.PoapsToBurn[0],
          this.state.PoapsToBurn[1],
          this.state.PoapsToBurn[2],
          this.state.PoapsToBurn[3],
          this.state.PoapsToBurn[4],
        ], uri)
        .send({
          from: this.account,
          gasAmount,
        });
    }
  };

  checked = async (t, tokenId, checked) => {
    if (checked) {
      //console.log("checked");
      //console.log(this.state.PoapsToBurn.length);
      if (this.state.PoapsToBurn.length == 5) {
        this.setState({ countAlert: true });
        return false;
      } else {
        this.state.PoapsToBurn.push(tokenId);
        return true;
      }
    } else {
      //console.log("unchecked");
      const index = this.state.PoapsToBurn.indexOf(tokenId);
      if (index > -1) {
        this.state.PoapsToBurn.splice(index, 1); // 2nd parameter means remove one item only }
        //this.state.PoapsToBurn.remove(tokenId);
      }
    }
    //console.log("this.state.PoapsToBurn");
    console.log(this.state.PoapsToBurn);
    return true;
  };


  setShow = async (e) => {
    this.setState({ countAlert: false });
  };

  render() {
    let poapCards = [];
    if (this.state.renderCards) {
      poapCards = this.state.Poaps.map((POAP, index) => {
        return (
          <div className="col-md-4 col-lg-2">
            <POAPCard POAP={POAP} checked={this.checked} key={POAP.tokenId} />
          </div>
        );
      });
    }
    // let active = 1;
    // let items = [];
    // for (let number = 1; number <= this.state.pageCount; number++) {
    //   items.push(
    //     <Pagination.Item key={number} data-page={number} active={number === active} onChange={this.changePage}>
    //       {number}
    //     </Pagination.Item>,
    //   );
    // }
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
              onClick={this.fetchData}
              disabled={this.state.loading}
            >
              Connect & list POⒶPs
            </Button>{" "}
            {"   "}
          </Col>
          <Col md={6}>
            <Button className="glitch" onClick={this.burn}>
              Burn 💩 and 🚀{" "}
            </Button>
          </Col>
        </Row>
        <Row xs={2} md={2} lg={5}>
          {Array.from(this.state.Poaps).map((POAP, idx) => (
            <POAPCard POAP={POAP} checked={this.checked} key={POAP.tokenId} />
          ))}
        </Row>
        {/* <Row>
          <CardDeck style={{ display: 'flex', flexDirection: 'row' }}>
            {poapCards}
          </CardDeck >
        </Row> */}
        <br></br>
        <Row>
          <Col xs={12}>
            {this.state.loading && (
              <>
                <Spinner animation="border" size="sm" />
              </>
            )}
          </Col>
        </Row>

        <br></br>
        <Modal
          show={this.state.countAlert}
          onHide={this.handleClose}
          style={{ paddingTop: "20%" }}
        >
          <Alert
            variant="danger"
            onClose={() => this.setShow(false)}
            dismissible
            style={{ marginBottom: "0px" }}
          >
            <Alert.Heading>Less 🔥, more ❤️‍🔥</Alert.Heading>
            <p>Keep some POⒶPs, they used to be good peeps.</p>
          </Alert>
        </Modal>
        <Row></Row>
      </Container>
    );
  }
}

export default PoapBurnPage;
