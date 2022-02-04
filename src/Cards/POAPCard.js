import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../App.css';


class POAPCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poapPopup: false,
            checked: false,
        };
        console.log("Test");
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
                <div className="col xs = {12}" key={this.props.index}>
                    <div className="container" >
                        <Card style={{ width: '10em' ,height: '20em'}}key={this.props.index}>
                            <Card.Img variant="top" src={this.props.POAP.image_url} alt="No Image" />

                            <Card.Title>
                                {this.props.POAP.name}
                            </Card.Title>
                            <Card.Body>
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