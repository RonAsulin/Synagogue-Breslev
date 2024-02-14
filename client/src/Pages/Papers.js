import React, { useEffect, useState } from "react";
import FirebaseClient from "../api/FirebaseClient";
import { getDownloadURL, ref } from "firebase/storage";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "../css/backGpaper.css";
import forest from "../pics/forest.png";

const Papers = () => {
  const [pdfURL, setPdfURL] = useState("");
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      // Get the window's inner width
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 768);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleWindowResize);

    // Call the function once on mount to set the initial value
    handleWindowResize();

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const cl = FirebaseClient.getInstance();
        const res = await cl.GetPapers();
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setPdfList(res);
          if (res.length !== 0) {
            setPdfURL(res[0].file.download_url);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPDF();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      document.documentElement.style.setProperty(
        "--page-height",
        `${height}px`
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePdfSelection = async (pdf) => {
    setSelectedPdf(pdf);
    setShowOptions(false);
    const storage = FirebaseClient.GetStorage();
    const pdfRef = ref(storage, pdf.file.download_url);
    const url = await getDownloadURL(pdfRef);
    setPdfURL(url);
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const getBackgroundImage = () => {
    return isMobile
      ? "url(path/to/mobile-background.jpg)"
      : "url(path/to/desktop-background.jpg)";
  };

  return (
    <div className="main-container">
      <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <div className="">
        <div className="tracking-in-expand-fwd-top">
          <h1
            className="page-title"
            style={{ fontFamily: "shmulikclm-webfont" }}
          >
            עלון-הקהילה
          </h1>
        </div>
        <div>
          {!isMobile && (
            <div
              className="pdf-container"
              style={{
                position: "absolute",
                top: "300px", // כדי להגביר את המרחק מהכותרת
                left: "50%",
                transform: "translateX(-50%)",
                width: "42%",
                height: "103%",

                zIndex: 999,
              }}
            >
              {pdfURL ? (
                <iframe
                  src={pdfURL}
                  title="PDF Viewer"
                  className="pdf-frame"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <p className="pdf-loading-message">Loading PDF...</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        {!isMobile && (
          <div className="sidebar">
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                position: "absolute",
                top: 10,
                right: 0,
                width: "100%",
                maxWidth: "300px",
              }}
            >
              <CardHeader
                title="עלונים אחרונים"
                style={{ textAlign: "center" }}
              />
              <CardContent>
                <Button
                  onClick={handleToggleOptions}
                  style={{ width: "100%", marginBottom: "8px" }}
                >
                  {showOptions ? "סגור" : "פתח"}
                </Button>
                <Collapse in={showOptions}>
                  <List>
                    {pdfList.map((pdf) => (
                      <ListItem
                        button
                        key={pdf._id}
                        onClick={() => handlePdfSelection(pdf)}
                        selected={selectedPdf && selectedPdf.id === pdf.id}
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          textAlign: "right",
                        }}
                      >
                        <ListItemText primary={pdf.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {isMobile && pdfURL && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <a
            href={pdfURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              className="btn-custom"
              variant="contained"
              color="primary"
              style={{ width: "200px", fontSize: "20px" }}
            >
              פתח עלון
            </button>
          </a>
          <div
            className="sidebar"
            style={{
              position: "absolute",
              top: "unset",
              left: "calc(50% - 150px)",
              marginTop: "20%",
            }}
          >
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              <CardHeader
                title="עלונים אחרונים"
                style={{ textAlign: "center" }}
              />
              <CardContent>
                <Button
                  onClick={handleToggleOptions}
                  style={{ width: "100%", marginBottom: "8px" }}
                >
                  {showOptions ? "סגור" : "פתח"}
                </Button>
                <Collapse in={showOptions}>
                  <List>
                    {pdfList.map((pdf) => (
                      <ListItem
                        button
                        key={pdf._id}
                        onClick={() => handlePdfSelection(pdf)}
                        selected={selectedPdf && selectedPdf.id === pdf.id}
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          textAlign: "right",
                        }}
                      >
                        <ListItemText primary={pdf.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Papers;
