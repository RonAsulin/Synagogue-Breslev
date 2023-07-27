import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, FormControl,Offcanvas } from "react-bootstrap";
import '../css/header.css'
import {RiAdminLine, RiAdminFill} from 'react-icons/ri'

import HebDate from '../components/HebDate';

import axios from "axios";
import Logo from '../pics/myfire.png';
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
import Deadlines from "./Deadlines";

function Dashboard() {
 
  const adminFullIcon = <RiAdminLine style={{ color: 'red' }} size={20} />;
  const adminFillIcon = <RiAdminFill style={{ color: 'green' }} size={20} />;
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalShown, setModalShwown] = useState(false);
  const [view,setView] = useState()
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const baseURL = "http://localhost:3001/api";
  const [pageSelected, setPageSelected] = useState(null);
  const isMobileDevice = window.innerWidth <= 768;
  
 const handlePageSelect = (selectedPage) => {
    setView(selectedPage);
 }

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
    case "deadlines":
      return (<Deadlines isAdmin={isAdmin}/>);  
    default:
      return (<Main setView={setView} isAdmin={isAdmin}/>);
  }
  
}

    
  return (
    <>
      {isMobileDevice ? (
        // Offcanvas Navbar עבור מסך קטן
        <Navbar expand="sm" className="bg-body-tertiary mb-0">
          {/* תוכן הOffcanvas Navbar */}
          <Container fluid>
            <Navbar.Brand href="/">     
         <div className="navbar-container">  
              <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={Logo}
          style={{ width: 75, height: 75 , marginLeft:-17}}
          alt="Logo"
        />
<span className="large-text" style={{ fontFamily: 'StamSefaradCLM', fontWeight: 'bold', marginLeft: '26.05px',marginTop:'10px', color: '#8ddca4', textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000', textDecoration: 'underline' }}>
  קהילת חסידי ברסלב
</span>
      </div>
      </div> 
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" />
            <Navbar.Offcanvas
            
              id="offcanvasNavbar-expand-sm"
              aria-labelledby="offcanvasNavbarLabel-expand-sm"
              placement="end"
              className="offcanvas"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-sm" style={{fontSize:'30px',color:'#8ddca4', textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000'}}>
                 :תפריט
                </Offcanvas.Title>
              </Offcanvas.Header>
        <Offcanvas.Body>

          <Nav className="justify-content-end flex-grow-1 " style={{textAlign:'right',marginBottom:'60px',fontSize:'16px'}}>
            {isAdmin && (
              <Nav.Link onClick={() => handlePageSelect("admin")}>Management</Nav.Link>
            )}
            <Nav.Link onClick={() => handlePageSelect("main")}>דף ראשי</Nav.Link>
             <Nav.Link onClick={() => handlePageSelect("prayingTimes")}>זמני תפילות</Nav.Link>
            <Nav.Link onClick={() => handlePageSelect("message")}>הודעות</Nav.Link>
            <Nav.Link onClick={() => handlePageSelect("papers")}>עלונים</Nav.Link>
            <Nav.Link onClick={() => handlePageSelect("deadlines")}>מועדים</Nav.Link>
            <Nav.Link onClick={() => handlePageSelect("donation")}>תרומות</Nav.Link>
            <Nav.Link onClick={() => handlePageSelect("about")}>אודות</Nav.Link>
            {modalShown && loginModal()}
          </Nav>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
            <SocialIcon
              url="https://www.facebook.com/profile.php?id=100044592576797"
              className="me-1"
              target="_blank"
              fgColor="#fff"
              style={{ height: 32, width: 32, margin: '0 10px' }}
            />
            <SocialIcon
              url="https://www.youtube.com/@Shuvu_Banim"
              className="me-1"
              target="_blank"
              fgColor="#fff"
              style={{ height: 32, width: 32, margin: '0 10px' }}
            />
            <SocialIcon
              url="https://open.spotify.com/playlist/3BkNWcIBTD1E5KvtsIvqau"
              className="me-1"
              target="_blank"
              fgColor="#fff"
              style={{ height: 32, width: 32, margin: '0 10px' }}
            />
         <Button
            style={{ marginRight: 13, backgroundColor: 'transparent' }}
            className={isAdmin ? 'admin-button-active' : 'admin-button-inactive'}
            onClick={async () => {
              if (!isAdmin)
                setModalShwown(true)
              else {
                const cl = FirebaseClient.getInstance();
                await cl.logout();
                setIsAdmin(!isAdmin)
              }
            }}
            variant={!isAdmin ? "outline-info" : 'danger'}
          >
            {isAdmin ? adminFullIcon : adminFillIcon}
          </Button>
          </div>
 
        </Offcanvas.Body>
            <div className="d-flex" style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>
            <DigitalClock />
          </div>
          <div className="my-element">
            <HebDate />
          </div>
          
            </Navbar.Offcanvas>
            
          </Container>
          
        </Navbar>
        
      ) : (
        // Navbar רגיל
        <Navbar style={{ backgroundColor: 'rgba(255, 255, 255, .1)' }}>
          {/* תוכן הNavbar רגיל */}
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
            onClick={async () => {
              if (!isAdmin)
                setModalShwown(true)
              else {
                const cl = FirebaseClient.getInstance();
                await cl.logout();
                setIsAdmin(!isAdmin)
              }
            }}
            variant={!isAdmin ? "outline-info" : 'danger'}
          >
            {isAdmin ? adminFullIcon : adminFillIcon}
          </Button>
          <div className="d-flex" style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>
            <DigitalClock />
          </div>
          <div className="my-element">
            <HebDate />
          </div>
          <Container className='Header font-extrabold'>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto font-bold">
                {isAdmin && <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("admin")} >Management</Nav.Link>}
                                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("about")}>אודות</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("donation")}>תרומות</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("deadlines")}>מועדים</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("papers")}>עלונים</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("message")}>הודעות</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("prayingTimes")}>זמני תפילות</Nav.Link>
                <Nav.Link style={{ fontWeight: 600 }} onClick={() => setView("main")}>דף ראשי</Nav.Link>
              </Nav>
              {modalShown && loginModal()}
            </Navbar.Collapse>
          </Container>
          <img
            src={Logo}
            style={{ width: 130, height: 120, marginRight: 10 }}
            alt="Logo"
          />
        </Navbar>
      )}
      {/* תכנים נוספים של העמוד */}
      {/* ... */}
      {renderContent()}
    </>
  )
}

export default Dashboard;