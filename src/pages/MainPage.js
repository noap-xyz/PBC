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
        
    }


    render() {
        return (
            <div>

                <div class="container">
                    <div class="row top-buffer">
                        <Col xs={6}>
                            
                            <div class="row top-buffer">

                                <div class="col-xl-8">
                                    <Button  onClick={() => history.push('/PoapBurnPage')} >POⒶP🔥🎉</Button>
                                </div>

                            </div>
                            <div class="row top-buffer ">

                                <h2> Why burn POⒶPs?</h2>

                                <blockquote class="blockquote">
                                <p class="mb-0">POAPs are a commercial activity subject to US sanctions.</p>
                                <footer class="blockquote-footer">Isabel Gonzalez - <cite title="Source Title">POAP Chief Operating Officer </cite>(<a href="https://twitter.com/shiryakhat/status/1485305351234805764" target="_blank">ref</a>)</footer>
                                </blockquote>
                                <div class="row top-buffer text-left">

                                <h5> Backstory: A Farsi podcast, <a href="https://twitter.com/shiryakhat/status/1484547277142245382" target="_blank">Shir Ya Khat</a>, created a POAP to send to their <a href="https://gitcoin.co/grants/152/ethereum-for-farsi-speaking-population" target="_blank">Gitcoin</a> & <a href="https://giveth.io/project/solidity-development-course-in-farsi-by-women-in-blockchain-iran" target="_blank">Giveth</a> grant contributors and was bluntly rejected due to their language being Farsi <small>(and with no connection with any sanctioned countries) </small></h5>
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
                                                        <Image src='./POAP.PNG' thumbnail />
                                                        <div class="card-text">
                                                        <a href="https://poap.gallery/event/23196" target="_blank">23196</a> - Shir ya Khat Astronauts <a href="https://twitter.com/shiryakhat/status/1485326873471209475" target="_blank">🙅‍♂️</a>
                                                        </div>
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