import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import FirebaseClient from '../api/FirebaseClient';
import forest from '../pics/forest.png';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [, setIsMobile] = useState(false);

    useEffect(() => {
    fetchMessages();
    handleWindowSizeChange(); // קריאה ראשונית לפונקציה לקביעת ערך ה-isMobile
    window.addEventListener('resize', handleWindowSizeChange); // הוספת אירוע על שינוי גודל המסך
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange); // הסרת האירוע כאשר הקומפוננטה מורדת
    };
  }, []);
  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const cl = FirebaseClient.getInstance();
      const res = await cl.GetMessages();
      if (res instanceof Error) {
        toast.error(res.message);
      } else {
        // Add isOpen field to each message object if it doesn't exist
        const updatedMessages = res.map((message) => ({
          ...message,
          isOpen: false,
        }));
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };

const handleToggleMessage = (id, e) => {
  // Check if the click occurred on the title and not the "X" icon (close-icon)
  if (e.target.classList.contains('title')) {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, isOpen: !message.isOpen } : message
      )
    );
  }
};

const handleOpenMessage = (id, e) => {
  // Check if the click occurred on the title and not the message body
  if (e.target.classList.contains('title')) {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, isOpen: !message.isOpen } : message
      )
    );
    
  }
};
const handleCloseMessage = (id, e) => {
  // Stop the event from propagating to the handleOpenMessage function
  e.stopPropagation();

  setMessages((prevMessages) =>
    prevMessages.map((message) =>
      message.id === id ? { ...message, isOpen: false } : message
    )
  );
};
    const isMobileDevice = window.innerWidth <= 768; // Check if the device is mobile


 return (
     <div className="main-container">
      <div className="background-container">
        {/* Use a regular <img> tag for the background image */}
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <h1 style={{fontFamily:'shmulikclm-webfont'}} className="page-title logo tracking-in-expand-fwd-top">הודעות בית-מדרשינו</h1>
      <Container className="notice-board">
        {messages.map((message, index) => (
          <div key={message.id}>
            {index !== 0 && <hr className="divider" />}
            <Card
              className={`message-card ${message.isOpen ? 'open' : ''}`}
            >
             <Card.Header className={`title ${message.isOpen ? 'open' : ''}`}
             onClick={(e) => handleToggleMessage(message.id, e)}>
                <span>{message.title}</span>
                <div className="title-underline"></div>
                {message.isOpen && (
                  <span className="close-icon" onClick={(e) => handleCloseMessage(message.id, e)}>
                    &#10005;
                  </span>
                )}
              </Card.Header>
              {message.isOpen && (
                  <Card.Body className="body" onClick={(e) => handleToggleMessage(message.id, e)}>
                    {message.message}
               </Card.Body>
              )}
            </Card>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Message;
