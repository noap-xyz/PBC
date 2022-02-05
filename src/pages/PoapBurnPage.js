import logo from '../logo.svg';
import '../App.css';
import {Row, Col,Alert} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import React, { Component, useState } from "react";
import POAPCard from '../Cards/POAPCard';
import Pagination from 'react-bootstrap/Pagination'
import poapcontract from '../utils/poapcontract.js'



class PoapBurnPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connectedAddress: "Wallet Is Dissconnected!",
      connectedAddressStatus: "warning",
      Poaps: [],
      PoapCount: 0,
      renderCards: false,
      PoapsToBurn: [],
      pageCount: 0,
      querized: false,
      noInPage: 10
    };
  }
  componentDidMount() {
    setInterval(async () => {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      this.setState({ connectedAddress: account });
    }, 1000)
  }
  fetchData = async (t) => {
    t.preventDefault();
    var gasAmount = await poapcontract.methods.balanceOf("0x90371fc9837c44d3fe17a9be68696fde51fcc011").estimateGas({ from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011" });
    console.log('gasAmount');
    console.log(gasAmount);
    var poapCount = await poapcontract.methods.balanceOf("0x90371fc9837c44d3fe17a9be68696fde51fcc011").call({
      from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011",
      gasAmount,
    });

    console.log('poapCount');
    console.log(poapCount);
    this.setState({ pageCount: poapCount / this.state.noInPage });
    if (this.state.pageCount > 1) {
      this.setState({ querized: true });
    }
    //
    await this.fetchPoaps(0).then(results => {
      if (this.state.PoapCount == poapCount) {
        this.setState({ Poaps: results });
      }
    });
  }
  fetchPoaps = async (pageCount) => {
    //t.preventDefault();
    var results = [];
    for (var i = this.state.noInPage * pageCount; i < this.state.noInPage * pageCount + this.state.noInPage; i++) {
      var gasAmount = await poapcontract.methods.tokenDetailsOfOwnerByIndex("0x90371fc9837c44d3fe17a9be68696fde51fcc011", i).estimateGas({ from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011" });
      var Poap = await poapcontract.methods.tokenDetailsOfOwnerByIndex("0x90371fc9837c44d3fe17a9be68696fde51fcc011", i).call({
        from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011",
        gasAmount,
      });
      //console.log('Poap');
      //console.log(Poap);
      gasAmount = await poapcontract.methods.tokenURI(Poap.tokenId).estimateGas({ from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011" });
      var PoapURI = await poapcontract.methods.tokenURI(Poap.tokenId).call({
        from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011",
        gasAmount,
      });
      //console.log('PoapURI');
      //console.log(PoapURI);

      fetch(PoapURI).then(res => res.json()).then(
        result => {
          //console.log(result);
          var resObj = result;
          resObj.tokenId = Poap.tokenId;
          results.push(resObj);
        }
      )
      //this.state.Poaps.push(Poap);
    }

    this.setState({ Poaps: results });
    console.log("this.state.Poaps");
    console.log(this.state.Poaps);
    this.setState({ poapCount: results.length });
    //this.setState({ Poaps: result});
    this.setState({ renderCards: true });
    return results;
  };

  burn = async (t) => {
    t.preventDefault();
    var gasAmount = await poapcontract.methods.setApprovalForAll("0x90371fc9837c44d3fe17a9be68696fde51fcc011", true).estimateGas({ from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011" });
    var result = await poapcontract.methods.setApprovalForAll("0x90371fc9837c44d3fe17a9be68696fde51fcc011", true).send({
      from: "0x90371fc9837c44d3fe17a9be68696fde51fcc011",
      gasAmount,
    });
  }

  checked = async (t, tokenId, checked) => {

    if (checked) {
      this.state.PoapsToBurn.push(tokenId);
    }
    else {
      const index = this.state.PoapsToBurn.indexOf(tokenId);
      if (index > -1) {
        this.state.PoapsToBurn.splice(index, 1); // 2nd parameter means remove one item only }
        //this.state.PoapsToBurn.remove(tokenId);
      }
    }
    console.log("this.state.PoapsToBurn");
    console.log(this.state.PoapsToBurn);
  }

  changePage = async (e) => {
    console.log('pagination');
    const clickValue = e.target.offsetParent.getAttribute('data-page')
      ? e.target.offsetParent.getAttribute('data-page')
      : e.target.getAttribute('data-page');
    console.log(clickValue);
    this.fetchPoaps(clickValue - 1);
  }
  render() {
    let poapCards;
    if (this.state.renderCards) {
      poapCards = this.state.Poaps.map((POAP, index) => {
        return (<div class="col-xl-3 col-lg-6">
          <POAPCard POAP={POAP} index={index} checked={this.checked} />
        </div>)

      });
    }
    let active = 1;
    let items = [];
    for (let number = 1; number <= this.state.pageCount; number++) {
      items.push(
        <Pagination.Item key={number} data-page={number} active={number === active} onChange={this.changePage}>
          {number}
        </Pagination.Item>,
      );
    }
    return (
      <div>

        <div class="jumbotron">
          <h2> Burn!  </h2>
        </div>
        <Row>
          <Col xs={12}>
            <h2> 💩 🔥 </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>

            <Alert variant={this.state.connectedAddressStatus}>{this.state.connectedAddress}</Alert>
          </Col>
        </Row>

        <Button variant="secondary btn-block" onClick={this.fetchData}>Show 💩s</Button> {'   '}

        <div class="form-row">
          <CardDeck tyle={{ display: 'flex', flexDirection: 'row' }}>
            {poapCards}
          </CardDeck >
        </div>
        <br />
        <div class="form-row">
          {this.state.querized && <Pagination size="sm" onClick={this.changePage}>{items}</Pagination>}
        </div>
        <br />
        <br></br>

        <Row>

          <Button variant="success btn-block" onClick={this.burn}>burn 💩s and mint</Button>

        </Row>
      </div>
    );
  }
}

export default PoapBurnPage;