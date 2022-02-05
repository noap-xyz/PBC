import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
class AssetRequestCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestPopup: false
        };
        this.reqDes = React.createRef();
        this.datFrom = React.createRef();
        this.datTo = React.createRef();
    }
    click = async () => {
        this.setState({ requestPopup: true });
        //this.props.RequestDonation(this.props.asset.assetId);
    }

    saveRequest = async () => {
        //this.setState({ requestPopup: true });
        this.props.RequestDonation({ assetId: this.props.donation.assetId, reqDes: this.reqDes.current.value, datFrom: this.datFrom.current.value, datTo: this.datTo.current.value });
    }

    handleClose = () => {
        this.setState({ requestPopup: false });
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
    render() {
        return (

            <div>
                <br></br>
                <div class="col xs = {3}" key={this.props.donation.assetId}>

                    <div class="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Img variant="top" src={'https://ipfs.io/ipfs/' + this.props.asset.imageIPFSHash} alt="" />
                            </div>
                            <Card.Body>
                                <Card.Title>Title: {this.props.asset.title}</Card.Title>
                                <Card.Text>
                                    Description: {this.props.asset.assetDescription}</Card.Text>
                                <Card.Text>
                                    Location: {this.props.donation.location}</Card.Text>
                                <Card.Text>
                                    Status: {this.decodeStatus(this.props.donation.status)}
                                </Card.Text>
                                <Button variant="secondary" onClick={this.click}>Request Asset</Button>
                            </Card.Body>
                        </Card>
                        <Modal show={this.state.requestPopup} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Requset</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><div class="card shadow mb-4">
                                <div class="card-header py-3">
                                </div>
                                <div class="card-body">

                                    <div class="container">
                                        <div class="row">
                                            <div class="col-12">
                                                <div>

                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="RequestDescription">Request Description</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            ref={this.reqDes}
                                                            placeholder="RequestDescription"
                                                            aria-label="RequestDescription"
                                                            aria-describedby="RequestDescription"
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="DatFrom">From(Date)</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            ref={this.datFrom}
                                                            placeholder="DatFrom"
                                                            aria-label="DatFrom"
                                                            aria-describedby="DatFrom"
                                                        />
                                                    </InputGroup>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="DatTo">To(Date)</InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <FormControl
                                                            ref={this.datTo}
                                                            placeholder="DatTo"
                                                            aria-label="DatTo"
                                                            aria-describedby="DatTo"
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose} disabled={this.state.buttonDisabled}>
                                    Close
          </Button>
                                <Button variant="secondary" onClick={this.saveRequest} disabled={this.state.buttonDisabled}>
                                    Save Changes
          </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}

export default AssetRequestCard;