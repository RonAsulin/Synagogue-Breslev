import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Function to format the time in Israel's local time (IST timezone)
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-IL', {
      timeZone: 'Asia/Jerusalem',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const clockContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    boxShadow:'rgba(255, 255, 255, 0.02)'
    
  };

  const clockTextStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#8DDCA4',
    textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000',
    margin: '0',
  };

  return (
    <div style={clockContainerStyle}>
      <span style={clockTextStyle}>{formatTime(currentTime)}</span>
    </div>
  );
};

export default DigitalClock;
