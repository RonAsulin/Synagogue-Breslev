import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import FirebaseClient from '../api/FirebaseClient';
import forest from '../pics/forest.jpg';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);

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

  const handleToggleMessage = (id) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, isOpen: !message.isOpen } : message
      )
    );
  };

  return (
    <div className="main-container">
      <img src={forest} alt="forest" className="background-image" />
      <div className="tracking-in-expand-fwd-top">
        <h1 className="page-title">הודעות בית כנסת</h1>
      </div>
      <Container className="notice-board">
        {messages.map((message, index) => (
          <div key={message.id}>
            {index !== 0 && <hr className="divider" />}
            <Card
              className={`message-card ${message.isOpen ? 'open' : ''}`}
              onClick={() => handleToggleMessage(message.id)}
            >
              <Card.Header className="title">
                <span>{message.title}</span>
                <div className="title-underline"></div>
              </Card.Header>
              {message.isOpen && (
                <Card.Body className="body">{message.message}</Card.Body>
              )}
            </Card>
          </div>
        ))}
      </Container>
    </div>
  );
};
export default Message;
