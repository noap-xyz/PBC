import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import '../App.css';


class POAPCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }
    handleCheckboxChange = async (t) => {
        var newVAl = !this.state.checked;        
        await this.props.checked(t, this.props.POAP.tokenId, newVAl).then(result => {
            if(result){
                this.setState({ checked: newVAl });
            }
        })
    }

    render() {

        return (
            <div>
                <br></br>
                <div key={this.props.POAP.tokenId}>
                    <div className="container" >
                        <Card key={this.props.POAP.tokenId} >
                            <Card.Body class="photo-frame">
                            <Card.Img width="500" variant="top" src={this.props.POAP.image_url} alt="" />

                                <Card.Text>
                                    {this.props.POAP.name}</Card.Text>
                                <Form>
                                    <Form.Check aria-label="option 1" onChange={this.handleCheckboxChange} checked={this.state.checked}/>
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