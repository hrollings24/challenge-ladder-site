import React from 'react';
import * as BootStrap from 'react-bootstrap';
import MainUser from "../Persistance/MainUser"
import LogoImage from  "./logo"
import '../App.css';


function NavigationBar() {
  return (
    <BootStrap.Navbar collapseOnSelect expand="sm" bg="none" variant="dark" className="navbar navbar-dark">
    <BootStrap.Navbar.Brand>
  
    </BootStrap.Navbar.Brand>
    <BootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <BootStrap.Navbar.Collapse id="responsive-navbar-nav">
      <BootStrap.Nav className="mr-auto">
        <BootStrap.Nav.Link href="selectladder"><h4 className="linkText">Ladders</h4></BootStrap.Nav.Link>
        <BootStrap.Nav.Link href="#pricing"><h4 className="linkText">Challenges</h4></BootStrap.Nav.Link>
      </BootStrap.Nav>
      <BootStrap.Nav>
        <BootStrap.Nav.Link eventKey={2} href="account"><h4 className="linkText">
          Welcome, {MainUser.getInstance().getFullName()} </h4>
        </BootStrap.Nav.Link>
      </BootStrap.Nav>
    </BootStrap.Navbar.Collapse>
    </BootStrap.Navbar>
  );
}

export default NavigationBar;