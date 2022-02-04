import React, { Component } from "react";
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';
import '../App.css';
import { Row, Alert, Button, Pagination } from "react-bootstrap";
import POAPCard from '../Cards/POAPCard';
import getWeb3 from "../utils/getWeb3";
import poapcontract from '../utils/poapcontract.js'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            connectedAddress: "Wallet Is Dissconnected!",
            connectedAddressStatus: "warning",
            Poaps: [],
            PoapCount: 0,
            renderCards: false,
            PoapsToBurn: [],
            pageCount: 0,
            querized: false
        };
        this.searchAddress = React.createRef();

        this.chains = [
            { "1": "Ethereum" }, { "137": "Polygon" }
        ];
    }
    componentDidMount = async () => {
        setInterval(async () => {
            const accounts = await window.ethereum.enable();
            const account = accounts[0];
            this.setState({ connectedAddressStatus: "primary", connectedAddress: 'Connected Address: ' + account, account: account });
        }, 1000)
    };

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
        this.setState({ pageCount: poapCount / 20 });
        if (this.state.pageCount > 1) {
            this.setState({ querized: true });
        }
        //
        await this.fetchPoaps(1).then(results => {
            if (this.state.PoapCount == poapCount) {
                this.setState({ Poaps: results });
            }
        });
    }
    fetchPoaps = async (pageCount) => {
        //t.preventDefault();
        var results = [];
        for (var i = 20 * pageCount; i < 20 * pageCount+ 20; i++) {
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
        //this.setState({renderCards : true});
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
                {/* <CardDeck tyle={{ display: 'flex', flexDirection: 'row' }}>
                            {NFTCards}
                        </CardDeck > */}
                <Row>

                    <Button variant="secondary btn-block" onClick={this.fetchData}>Show 💩s</Button>

                </Row>
                <br></br>
                <Row>
                    <>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} bg="warning" />
                        </Placeholder>
                        <Placeholder as="p" animation="wave">
                            <Placeholder xs={12} bg="warning" />
                        </Placeholder>
                    </>
                    <Row xs={1} md={5} className="g-4">
                        {this.state.Poaps.map((POAP, index) => (
                            <POAPCard POAP={POAP} index={index} checked={this.checked} />
                        ))}
                    </Row>
                </Row>
                <div className="form-row">
                    {this.state.querized && <Pagination size="sm" onClick={this.changePage}>{items}</Pagination>}
                </div>
                <br></br>
               
                <Row>

                    <Button variant="success btn-block" onClick={this.burn}>burn 💩s and mint</Button>

                </Row>
            </div>
        )
    }
};

export default MainPage;
