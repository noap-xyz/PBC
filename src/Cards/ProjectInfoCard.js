import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import web3 from '../utils/web3.js'

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import projectfactorycontract from '../utils/projectfactorycontract.js'


class ProjectInfoCard extends Component {
    constructor(props) {
        super(props);
        this.donationAmount = React.createRef();
        this.state = {
            donated: 0
        };
     this.getProjectBalance(this.props.id);
    }
    getProjectBalance = async (t) => {
        //t.preventDefault();
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        const gasAmount = await projectfactorycontract.methods.getProjectBalance(t).estimateGas({ from: account });

        const result = await projectfactorycontract.methods.getProjectBalance(t).call({
            from: account,
            gasAmount,
        });
        const etherValue = web3.utils.fromWei(result.toString(10), 'ether');
        this.setState({donated:etherValue});
    }

    donate = async () => {
        const amn = this.donationAmount.current.value;
        console.log('amn');
        console.log(amn);
        this.props.donate({ projectId: this.props.id, donationAmount: amn });
    }
    render() {
        return (


            <div class="col" key={this.props.id}>

                <Card >
                    <Card.Body>
                        <Card.Text>
                            Title: {this.props.project.projectTitle}</Card.Text>
                        <Card.Text>
                            Description: {this.props.project.projectDescription}</Card.Text>
                        <Card.Text>
                            Minimum Kick off Balance: {this.props.project.projectKickOffMinBalance}</Card.Text>
                        <Card.Text>
                            Kick Off Time: {this.props.project.projectKickOffTime}</Card.Text>
                        <Card.Text>
                            Donatios collected: {this.state.donated}</Card.Text>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="donationAmount">Amount:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                ref={this.donationAmount}
                                placeholder="donationAmount(ether)"
                                aria-label="donationAmount"
                                aria-describedby="donationAmount"
                            />
                        </InputGroup>

                        <Button variant="outline-dark" onClick={this.donate}>Donate</Button>
                    </Card.Body>
                </Card>

            </div>

        )
    }
}

export default ProjectInfoCard;