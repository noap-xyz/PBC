import React, { Component } from "react";
import NFTCardDetails from '../Cards/NFTCardDetails';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import getWeb3 from "../utils/getWeb3";

class NFTDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slectedChainId:this.props.location.chainId,
            collectionAddress:this.props.location.contract_address
        };
        console.log(this.props.location.NFT);
        console.log(this.props.location.contract_address);
        console.log(this.props.location.chainId);
        this.fetchData();
    }

    fetchData = () => {
        let url = ' https://api.covalenthq.com/v1/' + this.state.slectedChainId + '/nft_market/collection/' + this.state.collectionAddress + '/?&key=ckey_d7c16845c96b46faa332ad48885'
        fetch(url).then(res => res.json()).then(
            result => {
                console.log(result.data.items);
            }
        )
    };
    render() {

        return (
            <div>
                <Row>
                    <Col sm = "12">
                        <NFTCardDetails NFT={this.props.location.NFT} id={1} key={1} />
                    </Col>
                    <Col sm = "7">
                        {/* <NFTCardDetails NFT={this.props.location.NFT} id={1} key={1} /> */}
                    </Col>
                </Row>
            </div>

        )
    }
};

export default NFTDetails;
