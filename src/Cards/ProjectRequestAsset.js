import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CardDeck from 'react-bootstrap/CardDeck';
import RequestCard from './RequestCard';
import donateAssetContract from '../utils/donatecontract'
import receiveAssetContract from '../utils/receivecontract'
import '../App.css';

class ProjectRequestAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Requests: [],
            requestPopup: false
        };
    }

    requestAssetForProject = async (t) => {
        t.preventDefault();
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        console.log(' this.props.projrctAddress');
        console.log( this.props.projrctAddress);
        const gasAmount = await receiveAssetContract.methods.requestAsset(this.props.donation.donationId, this.props.projrctAddress).estimateGas({ from: account });
        const result = await receiveAssetContract.methods.requestAsset(this.props.donation.donationId,  this.props.projrctAddress).send({
            from: account,
            gasAmount,
        });
        console.log('result');
        console.log(result);

    }
    decodeStatus = (t) => {
        switch (t) {
            case 0:
                return 'Free';
            case 1:
                return 'Requested';
            case 2:
                return 'Donated';
            case 3:
                return 'Inactive';
        }
    }
    handleClose = () => {
        this.setState({ requestPopup: false });
    }
    render() {
        return (
            <div>
                <br></br>
                <div class="col xs = {3}" key={this.props.donation.donationId}>
                    <div class="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Img variant="top" src={'https://ipfs.io/ipfs/' + this.props.asset.imageIPFSHash} alt="" />
                            </div>
                            <Card.Body>
                                <Card.Text>
                                    Description: {this.props.asset.assetDescription}</Card.Text>
                                <Card.Text>
                                    Location: {this.props.donation.location}</Card.Text>
                                <Card.Text>
                                    Status: {this.decodeStatus(this.props.donation.status)}
                                </Card.Text>
                                <Button variant="secondary" onClick={this.requestAssetForProject}>Request Asset</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectRequestAsset;