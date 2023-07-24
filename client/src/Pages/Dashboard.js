import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, FormControl } from "react-bootstrap";
import '../css/header.css'
import {RiAdminLine, RiAdminFill} from 'react-icons/ri'

import HebDate from '../components/HebDate';

import axios from "axios";
import Logo from '../pics/picLogo.png';
import { SocialIcon } from 'react-social-icons'
import TimesPray from "./TimesPray";
import Main from "./Main";
import Admin from "./Admin";
import Papers from "./Papers";
import About from "./About";
import Donation from './Donation';
import Message from "./Message";
import {toast} from 'react-toastify'
import FirebaseClient from "../api/FirebaseClient";
import DigitalClock from "../components/DigitalClock";

function Dashboard() {
 
  const adminFullIcon = <RiAdminLine style={{ color: 'red' }} size={20} />;
  const adminFillIcon = <RiAdminFill style={{ color: 'green' }} size={20} />;
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalShown, setModalShwown] = useState(false);
  const [view,setView] = useState()
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const baseURL = "http://localhost:3001/api";
  
  const fetchStorage = () => {
    const item = localStorage.getItem("uid");
    if(item)
      setIsAdmin(true);
  }

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
    fetchStorage();
    
  }, []);


  const loginModal = () => {
    return (<Modal show={modalShown} onHide={() => setModalShwown(false)}>

      <Modal.Header>
        <Modal.Title>Admin login</Modal.Title>
        <Modal.Body>
          <Form.Label>Email:</Form.Label>
          <FormControl value={email} onChange={(e) => setEmail(e.target.value) } type="email"/>
          <Form.Label>Password:</Form.Label>
          <FormControl value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
        </Modal.Body>
        <Button onClick={async () => {
          const cl = FirebaseClient.getInstance();
          const res = await cl.login(email,password);
          if(res instanceof Error)
            toast.error(res.message);
          else
          {
            setModalShwown(false);
            setIsAdmin(!isAdmin)
          }
            
        }}>Login</Button>
      </Modal.Header>

    </Modal>)
  }

  const handleDisconnect = () => {
    localStorage.clear();
   
  };
const renderContent = () => {
  switch (view) {
    case "prayingTimes":
      return (<TimesPray isAdmin={isAdmin}/>);
    case "about":
      return (<About isAdmin={isAdmin}/>);
    case "papers":
      return (<Papers isAdmin={isAdmin}/>);
    case "admin":
      return (<Admin isAdmin={isAdmin}/>);
    case "donation":
      return (<Donation isAdmin={isAdmin}/>);
    case "message":
      return (<Message isAdmin={isAdmin}/>);  
    default:
      return (<Main setView={setView} isAdmin={isAdmin}/>);
  }
  
}
    
  return (
    <>
      <Navbar style={{  backgroundColor: 'rgba(255, 255, 255, .1)'}} >
     <div className="d-flex py-4 px-2 my-3 align-items-center social-icon-wrapper justify-content-center">
  <div className="d-flex align-items-center">
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
  <div className="hover-line"></div>
</div>

      <Button
       style={{ marginRight: 13, backgroundColor: 'transparent' }}
       className={isAdmin ? 'admin-button-active' : 'admin-button-inactive'}
        onClick={async() => {
          if(!isAdmin)
            setModalShwown(true)
          else
          {
            const cl = FirebaseClient.getInstance();
            await cl.logout();
            setIsAdmin(!isAdmin)
          }
        }}
        variant={!isAdmin ? "outline-info" : 'danger'}
      >
         {isAdmin ? adminFullIcon : adminFillIcon} 
      </Button>
        <div className="d-flex" style={{marginLeft:10,alignItems:'center',justifyContent:'center'}}>
        <DigitalClock/>
     </div>
        <HebDate/>
  <Container className='Header font-extrabold'>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ms-auto font-bold">
      {isAdmin && <Nav.Link style={{fontWeight:600}} onClick={() => setView("admin")} >Management</Nav.Link>}
      <Nav.Link style={{fontWeight:600}}    onClick={() => setView("message")}>הודעות</Nav.Link>
       <Nav.Link style={{fontWeight:600}}    onClick={() => setView("donation")}>תרומות</Nav.Link>
      <Nav.Link style={{fontWeight:600}}  onClick={() => setView("papers")}>עלונים</Nav.Link>
      <Nav.Link style={{fontWeight:600}} onClick={() => setView("about")}>אודות</Nav.Link>
      <Nav.Link style={{fontWeight:600}} onClick={() => setView("prayingTimes")}>זמני תפילות</Nav.Link>
       <Nav.Link style={{fontWeight:600}} onClick={() => setView("main")}>דף ראשי</Nav.Link>
    </Nav>
    {modalShown &&
      loginModal()}
    </Navbar.Collapse>
    
  </Container>
    <Navbar.Brand href="/">
      <img
        src={Logo}
        style={{ width: 300 , height:100  }}
        alt="Logo"
      />
    </Navbar.Brand>
</Navbar>

      {renderContent()}
    </>
    
  )
}

export default Dashboard;