import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import web3 from '../utils/web3.js'


class RequestCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    requestApprove = async () => {
        let t = { donationId: this.props.donationId,assetId:web3.utils.hexToNumber(this.props.assetId._hex), receiver: this.props.request.receiver };
        console.log('tr');
        console.log(t);
        this.props.requestApprove(t);
    }
    decodeStatus = (t) => {
        switch (t) {
            case 0:
                return 'Open';
            case 1:
                return 'Approved';
        }

    }
    render() {
        return (

            <div>
                <br></br>
                <div class="col xs = {3}" key={this.props.donationId}>
                    <div class="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Header>Individual Request</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Description: {this.props.request.requestDescription}</Card.Text>
                                    <Card.Text>
                                        Date(From): {this.props.request.requestDateFrom}</Card.Text>
                                    <Card.Text>
                                        Date(To): {this.props.request.requestDateTo}</Card.Text>
                                    {this.props.readOnly && <Card.Text>
                                        Status: {this.decodeStatus(this.props.request.status)}</Card.Text>}
                                    {!this.props.readOnly && <Button variant="secondary" onClick={this.requestApprove}>Approve Request</Button>}
                                </Card.Body>
                            </div>
                        </Card>
                    </div>
                </div>
                <br></br>
            </div>
        )
    }
}

export default RequestCard;