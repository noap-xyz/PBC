import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import web3 from '../utils/web3.js'
import projectfactorycontract from '../utils/projectfactorycontract.js'

class ProjectRequestCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project:[]
        };
        this.getProject(this.props.request.receiver);
    }

    getProject = async (t) => {
        //t.preventDefault();
        const accounts = await window.ethereum.enable();
        const account = accounts[0];

        const gasAmount = await projectfactorycontract.methods.getProjectByAddress(t).estimateGas({ from: account });

        const result = await projectfactorycontract.methods.getProjectByAddress(t).call({
            from: account,
            gasAmount,
        });
        let projResult = { ProjectTitle: result[0], ProjectDescription: result[1] };
        let d = await this.getProjectBalance(t);
        this.setState({ project: projResult ,donated:d});

    };

    getProjectBalance = async (t) => {
        //t.preventDefault();
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        const gasAmount = await projectfactorycontract.methods.getProjectBalanceByAddress(t).estimateGas({ from: account });

        const result = await projectfactorycontract.methods.getProjectBalanceByAddress(t).call({
            from: account,
            gasAmount,
        });
        //console.log('result');
        const etherValue = web3.utils.fromWei(result.toString(10), 'ether');
        //console.log(etherValue);
        return etherValue;
    };
    requestApprove = async () => {
        let t = { donationId: this.props.donationId, assetId: web3.utils.hexToNumber(this.props.assetId._hex), receiver: this.props.request.receiver };
        console.log('tr');
        console.log(t);
        this.props.requestApprove(t);
    }
    render() {
        return (

            <div>
                <br></br>
                <div class="col xs = {3}" key={this.props.donationId}>
                    <div class="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Header>Project Request</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Project Title: {this.state.project.ProjectTitle}</Card.Text>
                                    <Card.Text>
                                        Project Description: {this.state.project.ProjectDescription}</Card.Text>
                                    {!this.props.readonly && <Button variant="secondary" onClick={this.requestApprove}>Approve Request</Button>}
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

export default ProjectRequestCard;