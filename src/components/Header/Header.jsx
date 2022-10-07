import React,{useEffect, useState} from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import './Header.css'
import {useNavigate} from 'react-router'
import { LinkContainer } from "react-router-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units';
import { injected } from "../Connectors";
import {motion} from 'framer-motion';


function Header() {
  const { active, account, activate, chainId } = useWeb3React();
  const balance = useBalance();
  const accountLength = String(account).length;
  const displayAccount = `${String(account).substring(0,4)}` + '...' + `${String(account).substring(accountLength-4,accountLength)}`;

  useEffect(() => {
    const activeWallet = async () => {
      if (!active) {
        try {
          await activate(injected);
        } catch (ex) {
          console.log("error:", ex);
        }
      } else {
        console.log('active');
      }
    };

    activeWallet();
  }, []);
  const navigate = useNavigate('')
  const handleNavigation = () => {
    return navigate('/createEvent')
  }

  return (

    <Navbar expand="lg">
      <Container>
          
        <LinkContainer to="/" className='PageName'>
            <Navbar.Brand >
              NOAPsEvents
            </Navbar.Brand>
        </LinkContainer>


        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-center" style={{ width: "100%" }}>
            <LinkContainer to="/">
              <Nav.Link className="d-flex align-items-center navBarLinks">
                <span>Home</span>
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/events">
              <Nav.Link className="d-flex align-items-center navBarLinks">
                <span>Events</span>
              </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/faq">
              <Nav.Link className="d-flex align-items-center navBarLinks">
                <span>FAQ</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <div className="justify-content-end" style={{ width: "100%" }}>
            <Nav className=" d-flex justify-content-end align-items-center">
              <div className="walletInfoBox">
                <div className="accountIcon"></div>
                <p className="account">
                  {displayAccount}
                </p>
              </div>
              <div className="walletInfoBox">
                <div className="balanceIcon"></div>
                <p className="accountBalanceNetworkTitle">
                  {chainId === 1 ? "Mainnet" : "Testnet"}
                </p>
                <p className="">
                  {balance}
                </p>
              </div>
              <Button onClick={handleNavigation} className="create-btn">
                Create Event
              </Button>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function useBalance(){
  const {account} =  useWeb3React();
  const [balance, setBalance] = useState();

  var Eth = require('web3-eth');

  var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');

  var Web3 = require('web3');
  var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

  useEffect(() => {
    if(account) {

      web3.eth.getBalance(account).then(val => setBalance(val));
      
    }
  }, [account]);

  return balance ? `${formatEther(balance)} ETH` : null;
}

export default Header;