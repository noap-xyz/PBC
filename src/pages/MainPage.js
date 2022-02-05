import React, { Component } from "react";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import history from '../utils/history';
import '../App.css';
import icon from '../icon.png';
import web3 from '../utils/web3.js'

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AdminUser: false,
            selectedAccoutnt: "0x0000000000000000000000000000000000000000"
        };
        this.setUp();
    }
    componentDidMount() {
        setInterval(async () => {
          const accounts = await window.ethereum.enable();
          const account = accounts[0];
          this.setState({ selectedAccoutnt: account });
        }, 1000)
      }
      setUp = async () => {
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
    }


    render() {
        return (
            <div>
                <div class="jumbotron">
                    <h2> Asset Donation  </h2>
                </div>
                <h7>  MM Account: {this.state.selectedAccoutnt}  </h7>
                <div class="container">
                    <div class="row top-buffer">
                        <Col xs={6}>
                            <div class="row top-buffer">
                                <div class="col-xl-6">
                                    <Button variant="secondary btn-block" onClick={() => history.push('/PoapBurnPage')} size={20}>Burn Poap</Button>
                                </div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                </div>
                                <div class="card-body">

                                    <div class="container">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="card">
                                                    <div class="card-body">
                                                        <Image src={icon} thumbnail />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </div>

                </div>
            </div>
        )
    }
};

export default MainPage;