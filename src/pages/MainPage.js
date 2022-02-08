import React, { Component } from "react";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Col, Row, Container } from 'react-bootstrap';
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
                <Container fluid>
                    <Row>
                        <Col xs={6} >
                            <Button onClick={() => history.push('/PoapBurnPage')} >POⒶP🔥🎉</Button>
                            <h2> Why !POAPs & NOAPs?</h2>

                            <blockquote class="blockquote">
                                <p class="mb-0">POAPs drops are a commercial activity subject to US sanctions.</p>
                                <footer class="blockquote-footer">Isabel Gonzalez - <cite title="Source Title">POAP Chief Operating Officer </cite>(<a href="https://twitter.com/shiryakhat/status/1485305351234805764" target="_blank">ref</a>)</footer>
                            </blockquote>
                            <Row>

                                <h3 class="top-buffer">Notarized Attendance Protocol (NOAP)<small> is decentralized stickers as a memorabilia on the BlockChain</small></h3>
                                <h4>Tl;dr Anyone can create an event and distribute stickers to the attendees.</h4>

                                <h5 class="top-buffer"> Backstory: A Farsi podcast, <a href="https://twitter.com/shiryakhat/status/1484547277142245382" target="_blank">Shir Ya Khat</a>, created a POAP to send to their <a href="https://gitcoin.co/grants/152/ethereum-for-farsi-speaking-population" target="_blank">Gitcoin</a> & <a href="https://giveth.io/project/solidity-development-course-in-farsi-by-women-in-blockchain-iran" target="_blank">Giveth</a> grant contributors and was bluntly rejected, AFAWK due to their language.
                                 {/* TODO: update the above text, the conclusion is weird, needs to be value oriented  */}
                                    {/* <small>(and with no connection with any sanctioned countries).</small>  */}
                                </h5>
                                <h6>
                                    ETHDenver #BUIDLATHON limited edition: "The first banned 💩" NFT for every 5 POAPs you NOAP.
                                </h6>
                                <h7>
                                    (Only 850 left, #0000 - #1150 has been sent to our beloved Gitcoin & Giveth contributors. We only can go to the moon together, LFG! ❤️)
                                {/* TODO: update these numbers -- finalize the contributors.json  */}
                                </h7>
                            </Row>

                        </Col>
                        <Col xs={6}>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                </div>
                                <div class="card-body">
                                    <Row>
                                        <Col>
                                            <div class="card">
                                                <div class="card-body">
                                                    <Image src='./POAP.PNG' thumbnail />
                                                    <div class="card-text">
                                                        <a href="https://poap.gallery/event/23196" target="_blank">23196</a> - Shir ya Khat Astronauts <a href="https://twitter.com/shiryakhat/status/1485326873471209475" target="_blank">🙅‍♂️</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                    </Row>

                </Container>
            </div>
        )
    }
};

export default MainPage;