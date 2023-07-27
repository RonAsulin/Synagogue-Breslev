import React from 'react'
import forest from '../pics/forest.png';

function About() {
  return (
     <div className="main-container">
      <div className="background-container">
        {/* Use a regular <img> tag for the background image */}
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <h1 className="page-title logo tracking-in-expand-fwd-top">אודות בית מדרשינו</h1>
      </div>
  )
}

export default About