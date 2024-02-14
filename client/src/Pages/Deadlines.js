import "../css/backGpaper.css";
import React, { useEffect, useState } from "react";
import {  Spinner } from "react-bootstrap";
import forest from "../pics/forest.png";
import FirebaseClient from "../api/FirebaseClient";

function Deadlines(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [pdfURL, setPdfURL] = useState("");
  const [pdfList, setPdfList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const cl = FirebaseClient.getInstance();
        const res = await cl.GetDeadLines();
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setPdfList(res);
          if (res.length !== 0) {
            setPdfURL(res[0].file.download_url);
          }
        }
        setLoading(false); // Data loaded, set loading to false
      } catch (error) {
        console.log(error);
        setLoading(false); // Error occurred, set loading to false
      }
    };

    fetchPDF();

    // Check if the user is on a mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
    );
  }, []);

  // Function to handle the PDF loading on mobile
  const handleMobilePDFLoad = () => {
    if (pdfList.length !== 0) {
      setPdfURL(pdfList[0].file.download_url);
    }
  };

  return (
    <div className="main-container">
      <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>

      <div className="tracking-in-expand-fwd-top">
        <h1 className="page-title" style={{ fontFamily: "shmulikclm-webfont" }}>
          מועדים
        </h1>
      </div>

      <div
        className="pdf-container"
        style={{
          position: "absolute",
          top: "300px", // Increase the distance from the title
          left: "50%",
          transform: "translateX(-50%)",
          width: "42%",
          height: "103%",
          zIndex: 999,
          display: !isMobile ? (pdfURL || loading ? "block" : "none") : "none", // Hide the iframe on mobile
        }}
      >
        {loading ? (
          <div className="loading-spinner">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : pdfURL ? (
          <iframe
            src={pdfURL}
            title="PDF Viewer"
            className="pdf-frame"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className=" pdf-loading-message">
            <p>אין </p>
            {!isMobile &&
              !pdfURL &&
              !loading && ( // Display the button only on non-mobile devices and when pdfURL is empty
                <button
                  className="btn-custom"
                  variant="contained"
                  color="primary"
                  style={{ width: "200px", fontSize: "20px" }}
                  onClick={handleMobilePDFLoad}
                >
                  פתח
                </button>
              )}
          </div>
        )}
      </div>

      {isMobile && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {pdfURL ? (
            <a
              href={pdfURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                className="btn-custom"
                variant="contained"
                style={{ width: "200px", fontSize: "20px" }}
              >
                פתח
              </button>
            </a>
          ) : (
            <div className=" pdf-loading-message"></div>
          )}
        </div>
      )}
      {pdfList.length === 0 && (
        <div className=" pdf-loading-message">
          <p>אין עדכון</p>
        </div>
      )}
    </div>
  );
}

export default Deadlines;
