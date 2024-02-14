import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import forest from "../pics/forest.png";
import image1 from "../pics/myfire.png";
import piclogo from "../pics/picLogo.png";
import Carousel from "react-bootstrap/Carousel";

import "../css/about.css";

function About() {
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [, setZoomedIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 3); // כאן 3 מייצג את מספר התמונות בקרוסלה
    }, 5000); // 5000 מייצג 5 שניות - שינוי לפי הצורך

    return () => clearInterval(intervalId);
  }, [index]);

  const handleZoom = (image, index) => {
    setZoomedImage(image);
    setZoomedIndex(index);
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setZoomedImage(null);
    setZoomedIndex(0);
    setIsZoomed(false);
  };

  return (
    <div className="main-container">
      <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <h1
        className="page-title logo tracking-in-expand-fwd-top"
        style={{ fontFamily: "shmulikclm-webfont" }}
      >
        אודות בית מדרשינו
      </h1>

      <div className="cards-container">
        {/* Text Card 1 */}
        <Card
          className="custom-card custom-card-text custom-text-card"
          style={{ height: "fit-content" }}
        >
          <Card.Body>
            <Card.Title>כותרת כרטיסיה 1</Card.Title>
            <Card.Text>
              שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום
              {/* Add your text content here */}
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Image Card 1 */}
        <Card className="custom-card">
          <Card.Img variant="top" src={image1} />
        </Card>
      </div>

      <div className="cards-container">
        {/* Text Card 2 */}
        <Card
          className="custom-card custom-card-text custom-text-card"
          style={{ height: "fit-content" }}
        >
          <Card.Body>
            <Card.Title>כותרת כרטיסיה 2</Card.Title>
            <Card.Text>
              שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום
              שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום
              שלום שלום שלום שלום שלום שלום שלום שלום שלום שלום
              {/* Add your text content here */}
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Image Card 2 */}
        <Card className="custom-card">
          <Card.Img variant="top" src={image1} />
        </Card>
      </div>

      {/* Carousel Card */}
      {isZoomed && (
        <div className="zoomed-container" onClick={closeZoom}>
          <img className="zoomed-image" src={zoomedImage} alt="Zoomed" />
        </div>
      )}
      <div className="cards-container ">
        <Card className=" carousel-container  special-card">
          <Carousel
            activeIndex={index}
            onSelect={(selectedIndex, e) => setIndex(selectedIndex)}
          >
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src={image1}
                alt="First slide"
                onClick={() => handleZoom(image1, 0)}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src={piclogo}
                alt="Second slide"
                onClick={() => handleZoom(piclogo, 1)}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src={
                  "https://breslov.co.il/wp-content/uploads/2020/02/%D7%91%D7%A8%D7%A1%D7%9C%D7%91-%D7%9C%D7%9B%D7%95%D7%9C%D7%9D.jpg"
                }
                alt="Third slide"
                onClick={() =>
                  handleZoom(
                    "https://breslov.co.il/wp-content/uploads/2020/02/%D7%91%D7%A8%D7%A1%D7%9C%D7%91-%D7%9C%D7%9B%D7%95%D7%9C%D7%9D.jpg",
                    2
                  )
                }
              />
            </Carousel.Item>
            {/* Add more Carousel.Items as needed */}
          </Carousel>
        </Card>
      </div>
    </div>
  );
}

export default About;
