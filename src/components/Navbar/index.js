import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav className="nav">
        <NavMenu>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/PoapBurnPage">Mint</NavLink>
          {/* <NavLink to='https://twitter.com/shiryakhat'>
			Twitter
		</NavLink>	 */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
