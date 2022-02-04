import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Mint extends Component {
  listAll = async (lnft) => {
    fetch('https://api.nftport.xyz/v0/me/mints?chain=polygon', {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "9dd184c0-2c6f-46a0-ac99-bbf92cf18951"
      }
    })

      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {

    return (
      <div>
      </div>

    )
  }

}
export default Mint;
