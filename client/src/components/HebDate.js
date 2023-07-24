import React, { useState, useEffect } from 'react';
import Hebcal from 'hebcal';

const HebrewDateWithParasha = () => {
  const [hebDate, setHebDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const hdate = new Hebcal.HDate(today);
    const hebDateString = `${hdate.toString('h')} פָּרָשַׁת: ${hdate.getSedra('h')}`;
    setHebDate(hebDateString);
  }, []);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    boxShadow: 'rgba(255, 255, 255, 0.02)'
  };

  const dateTextStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#8DDCA4',
    margin: '0',
    textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000',
  };

  return (
    <div style={containerStyle}>
      <p style={dateTextStyle}>{hebDate}</p>
    </div>
  );
};

export default HebrewDateWithParasha;
