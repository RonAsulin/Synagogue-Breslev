import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, FormControl } from "react-bootstrap";

import axios from "axios";
import Logo from '../pics/picLogo.png';
import { SocialIcon } from 'react-social-icons'

const Header = () => {
 
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalShown, setModalShwown] = useState(false);
  const [view,setView] = useState()
  const baseURL = "http://localhost:3001/api";
  
  const fetch = () => {
     const token =  localStorage.getItem("token")
    axios
      .get(baseURL + "/account/admin", {validateStatus: (num) => num >= 200,headers: {
        authorization: `Bearer ${JSON.parse(token)}`,   
      }})
      .then((response) => {
        if(response.status === 200)
        {
            console.log(response.data);
            setIsAdmin(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    fetch();
    
  }, []);


  const loginModal = () => {
    return (<Modal show={modalShown} onHide={() => setModalShwown(false)}>

      <Modal.Header>
        <Modal.Title>Admin login</Modal.Title>
        <Modal.Body>
          <Form.Label>Email:</Form.Label>
          <FormControl type="email"/>
          <Form.Label>Password:</Form.Label>
          <FormControl type="password"/>
        </Modal.Body>
        <Button onClick={() => {

        }}>Login</Button>
      </Modal.Header>

    </Modal>)
  }

  const handleDisconnect = () => {
    localStorage.clear();
   
  };

  return (
<Navbar bg="light" expand="lg">
      <Navbar.Brand >
      <img
        src={Logo}
        style={{ width: 300 , height:100  }}
        alt="Logo"
      />
    </Navbar.Brand>
            <Button
        style={{ marginRight:100 }}
        onClick={() => {
          setModalShwown(true)
        }}
        variant="outline-info"
      >
        Admin
      </Button>
  <Container >
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ms-auto">
      <Nav.Link href="/" className="btn btn-primary me">דף ראשי</Nav.Link>
      {isAdmin && <Nav.Link href="/manager" className="btn btn-secondary me-2" >Management</Nav.Link>}
      <Nav.Link href="/" className="btn btn-primary me-2">עלונים</Nav.Link>
      <Nav.Link href="/" className="btn btn-primary me-2">אודות</Nav.Link>
      <Nav.Link href="/timesPray" className="btn btn-primary me-2">זמני תפילות</Nav.Link>
    </Nav>


    {modalShown &&
      loginModal()}
    </Navbar.Collapse>
  </Container>
      <div className="d-flex py-4 px-2 my-3 align-items-center">
      <SocialIcon
        url="https://www.facebook.com/profile.php?id=100044592576797"
        className="me-1"
        target="_blank"
        fgColor="#fff"
        style={{ height: 32, width: 32 }}
      />
      <SocialIcon
        url="https://www.youtube.com/@Shuvu_Banim"
        className="me-1"
        target="_blank"
        fgColor="#fff"
        style={{ height: 32, width: 32 }}
      />
      <SocialIcon
        url="https://open.spotify.com/playlist/3BkNWcIBTD1E5KvtsIvqau"
        className="me-1"
        target="_blank"
        fgColor="#fff"
        style={{ height: 32, width: 32 }}
      />
    </div>
</Navbar>
 
  );
};

export default Header;