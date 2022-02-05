import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import '../App.css';


class POAPCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked:false
        };
    }
    handleCheckboxChange = async (t) => {
        console.log("t");
        console.log(this.state.checked);
        var newVAl = !this.state.checked;
        console.log(newVAl);
        this.setState({checked:newVAl});
        console.log(this.state.checked);
        this.props.checked(t,this.props.POAP.tokenId,newVAl);
    }

    render() {

        return (
            <div>
                <br></br>
                <div class="col xs = {3}" key={this.props.POAP.tokenId}>
                    <div class="container" >
                        <Card style={{ flex: 1 }} >
                            <div id="yourContainer">
                                <Card.Img variant="top" src={this.props.POAP.image_url} alt="" />
                            </div>
                            <Card.Body>
                                <Card.Text>
                                    Description: {this.props.POAP.name}</Card.Text>
                                    <Form>
                                    <Form.Check aria-label="option 1" onChange = {this.handleCheckboxChange}/>
                                    </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default POAPCard;