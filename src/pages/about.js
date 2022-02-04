import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col} from "react-bootstrap";

class About extends Component{
    constructor(props) {
        super(props);
      
    }

    render() {
        return (
                <div className="jumbotron">
                    <h2> About NFTCrawler Project </h2>
                    <br></br>
                </div>
        );
    }
}

export default About;
