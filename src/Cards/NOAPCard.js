import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "../App.css";

class NOAPCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backGroundColour: "light",
    };
  }

  render() {
    return (
      <div>
        <br></br>
        <div>
          <div className="container">
            <Card
              key={this.props.NOAP.tokenId}
              onClick={this.handleCheckboxChange}
              bg={this.state.backGroundColour}
            >
              <Card.Body className="photo-frame">
                <Card.Img
                  width="500"
                  variant="top"
                  src={this.props.NOAP.image}
                  alt=""
                />
                <Card.Text>{this.props.NOAP.name}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default NOAPCard;
