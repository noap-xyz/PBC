import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import web3 from "../utils/web3";
import '../App.css';
import history from '../utils/history';



class NFTCardDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nftPopup: false
        };
    }
    weiToEther = (t) => {
        var etherValue;
        if (t != null) {
            console.log(t);
            etherValue = web3.utils.fromWei(t, 'ether');
        }
        return etherValue;
    }


    render() {

        return (
            <div>
                <br></br>
                <div className="col xs = {3}" key={this.props.index}>
                    <div className="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Img variant="top" src={this.props.NFT.external_data.image} alt="No Image" />
                            </div>
                            <Card.Body>

                                <Card.Text>
                                    token_id: {this.props.NFT.token_id}</Card.Text>
                                <Card.Text>
                                    <Card.Text>
                                        Price: {this.weiToEther(this.props.NFT.token_price_wei)} ether
                                </Card.Text>
                                    token_url: {this.props.NFT.token_url}</Card.Text>
                                <Card.Text>
                                    description:{'  ' + this.props.NFT.external_data.description}
                                </Card.Text>


                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </div>
        )
    }
}

export default NFTCardDetails;