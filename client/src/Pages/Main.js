import React, { useEffect,useRef,useState } from 'react';
import { Nav, Card } from 'react-bootstrap';
import forest from "../pics/forest.jpg";
import logo from '../pics/picLogo.png';
import FirebaseClient from '../api/FirebaseClient'
import textImage from '../pics/textR.png';
import '../css/Main.css';
import Marquee from "react-fast-marquee";


const Main = (props) => {
  const setView = props.setView;
  

const [latestMessage, setLatestMessage] = useState('');

 useEffect(() => {
    // Fetch the latest message from Firebase
    const fetchLatestMessage = async () => {
      const cl = FirebaseClient.getInstance();
      const messages = await cl.GetMessages();
      if (!messages || messages.length === 0) {
        setLatestMessage('');
      } else {
        // Assuming that messages are sorted in descending order based on date
        setLatestMessage(messages[0].message);
      }
    };

    fetchLatestMessage();
  }, []);


 return (
    <>
      <div className="main-container">
        <img src={forest} alt="forest" className="background-image" />
        <div className="content">
          <div className="logo tracking-in-expand-fwd-top ">
            <img src={logo} alt="breslev" className="logo-image" />
          </div>
          <div className="buttons">
            <div className="button-group">
              <Nav.Link onClick={() => setView("about")} className="page-button">אודות</Nav.Link>
              <Nav.Link onClick={() => setView("prayingTimes")} className="page-button">זמני תפילות</Nav.Link>
              <Nav.Link onClick={() => setView("papers")} className="page-button">עלונים</Nav.Link>
            </div>
          </div>
 <div className="text">
            <img src={textImage} alt="rabe" className="text-image" />
            <Marquee  
            >
              <Card className='card'>
                <Card.Body className="marquee-content" style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', textShadow: '0px 0px 1px black, 0px 0px 5px black, 0px 0px 5px black, 0px 0px 5px black' }}>
                  {`|-${latestMessage}-|`}
                </Card.Body>
              </Card>
              </Marquee>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;