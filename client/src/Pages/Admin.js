import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Row, Col } from 'react-bootstrap';
import FirebaseClient from '../api/FirebaseClient';
import { toast } from 'react-toastify'
import { getDownloadURL, ref } from 'firebase/storage';
import { Button, Card, CardContent, CardHeader, Collapse, List, ListItem, ListItemText } from '@mui/material';
import '../css/btnStile.css';
import { HiTrash } from 'react-icons/hi';
import '../css/Main.css';
import forest from "../pics/forest.png";
import MessagesList from '../components/MessagesList.js'

function Admin(props) {
  const [isAdmin, setIsAdmin] = useState(props.isAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRowId, setIsEditingRowId] = useState(null);
  const [newRowData, setNewRowData] = useState({ time: '', day: '' });
  const [tableData, setTableData] = useState([]);
  const [pdfUpload, setPdfUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfURL, setPdfURL] = useState('');
  const [pdfList, setPdfList] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newTitle,setNewTitle] = useState('');
  const [pdfListDL, setPdfListDL] = useState([]);
  const [pdfUploadDL, setPdfUploadDL] = useState(null);
  const [pdfURLDL, setPdfURLDL] = useState('');
   const [showOptionsDL, setShowOptionsDL] = useState(false);
   
 const handleWindowResize = () => {
    // Get the window's inner width
    const windowWidth = window.innerWidth;
    

    if (windowWidth < 768) {

    } else {

    }
  };

  // Add event listener for window resize
  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  // UploadPdf functions

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const uploadPdf = async () => {
    setIsLoading(true); // הפעלת הטעינה

    const cl = FirebaseClient.getInstance();
    const arrHolder = [];
    if (pdfList.length === 5) {
      const deleted = await cl.DeletePaper(pdfList[4]);
      if (deleted instanceof Error) {
        alert(deleted.message);
        return;
      }

      for (let i = 0; i < pdfList.length; i++) {
        arrHolder.push(pdfList[i])
      }
      for (let i = arrHolder.length - 1; i > 0; i--) {
        arrHolder[i] = arrHolder[i - 1];
      }
    }

    const res = await cl.UploadFile(pdfUpload);

    if (res instanceof Error) {
      alert(res.message);
    } else {
      const dateUpload = Date.now();
      const dataEntry = { file: res, name: pdfUpload.name, date: dateUpload };
      const resEntry = await cl.AppendPaperEntry(dataEntry);

      if (resEntry instanceof Error) {
        alert(resEntry.message);
      } else {
        //do something
        alert("good");
        arrHolder[0] = resEntry;
        if (arrHolder.length === 1)
          setPdfList(arrHolder);
        else
          setPdfList([resEntry, ...pdfList])
      }
    }

    setIsLoading(false); // כיבוי הטעינה לאחר הסיום
  };

  const handlePdfSelection = async (pdf) => {
    setSelectedPdf(pdf);
    setShowOptions(false);
    const storage = FirebaseClient.GetStorage();
    const pdfRef = ref(storage,pdf.file.download_url);
    const url = await getDownloadURL(pdfRef);
    setPdfURL(url);
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const deletePdf = async (pdf) => {
    const cl = FirebaseClient.getInstance();
    const res = await cl.DeletePaper(pdf);
    if (res instanceof Error)
      alert(res.message);
    else
      setPdfList(pdfList.filter(paper => paper._id !== pdf._id));
  }

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const cl = FirebaseClient.getInstance();
        const res = await cl.GetPapers();
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setPdfList(res);
          const storage = FirebaseClient.GetStorage();
          const pdfRef = ref(storage, res[0].download_url);
          const url = await getDownloadURL(pdfRef);
          setPdfURL(url);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPDF();
  }, []);


  // TimesPray Functions
  const fetchData = async () => {

    const cl = FirebaseClient.getInstance();

    const res = await cl.GetPrayingTimes();

    if (res instanceof Error)
      toast.error(res.message);
    else {
      setTableData(res.map((entry, index) => ({ ...entry, id: index })));
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const handleEditRow = (id) => {

    if (isEditingRowId !== id) {
      setIsEditingRowId(id);
      const rowToEdit = tableData.find((row) => row.id === id);
      setNewRowData({ ...rowToEdit });
    }
  };

  const handleSaveEdit = async () => {

    const cl = FirebaseClient.getInstance();
    console.log(newRowData);
    const res = await cl.UpdatePrayingTime(newRowData)
    if (res instanceof Error)
      toast.error(res.message)
    else {
      const updatedTableData = tableData.map((row) =>
        row.id === isEditingRowId ? newRowData : row
      );
      setTableData(updatedTableData);
      setIsEditingRowId(null);
      setNewRowData({ time: '', day: '' });
    }
  };

  const handleDeleteRow = async (id) => {
    console.log(id);
    const cl = FirebaseClient.getInstance();
    const res = await cl.DeletePrayingTime(id);
    console.log(res);
    if (res instanceof Error) {
      toast.error(res.message);
    } else {
      const updatedTableData = tableData.filter((row) => row._id !== id); 
      setTableData(updatedTableData);
      toast.success("השורה נמחקה בהצלחה");
    }
  };

  const handleAddRow = async () => {
    const cl = FirebaseClient.getInstance();
    const timeAdded = Date.now();
    const newRow = { ...newRowData, created_at: timeAdded };

    const res = await cl.AppendPrayingTime(newRow);
    if (res instanceof Error) toast.error(res.message);
    else {
      setTableData([...tableData, newRow]);
      setNewRowData({ time: '', day: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({ ...prevData, [name]: value })); 
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
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
        setMessages(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

const handleAddMessage = async () => {
  try {
    const cl = FirebaseClient.getInstance();
     const timeAdded = Date.now();
    const newMessageData = {title:newTitle, message: newMessage ,date: timeAdded};
    const res = await cl.AppendMessage(newMessageData);

    if (res instanceof Error) {
      toast.error(res.message);
    } else {
      const updatedMessages = [...messages, res];
      setMessages(updatedMessages);
      setNewMessage('');
    }
  } catch (error) {
    console.log(error);
  }
};


const handleEditMessage = async (index, updatedMessage) => {
  try {
    const cl = FirebaseClient.getInstance();
    const updatedMessageData = { title: updatedMessage.title, message: updatedMessage.message };
    const res = await cl.UpdateMessage(messages[index].id, updatedMessageData);
    if (res instanceof Error) {
      toast.error(res.message);
    } else {
      const updatedMessages = [...messages];
      updatedMessages[index] = updatedMessage;
      setMessages(updatedMessages);
    }
  } catch (error) {
    console.log(error);
  }
};
const handleDeleteMessage = async (id) => {
  try {
    const cl = FirebaseClient.getInstance();
    const res = await cl.DeleteMessage(id);
    console.log('Delete message response:', res);
    if (res instanceof Error) {
      toast.error(res.message);
    } else {
      fetchMessages(); // Fetch updated messages from Firebase again
    }
  } catch (error) {
    console.log('Delete message error:', error);
  }
};


const handleCancelMessage = () => {
  setIsMessageOpen(false);
  setNewMessage('');
};

const handleInputChangeMsg = (event) => {
  setNewMessage(event.target.value);
};

  const handleOpenMessage = (message) => {
  setSelectedMessage(message); // עדכון ההודעה הנבחרת במשתנה selectedMessage
  // נוסיף כאן את הלוגיקה הנדרשת לעיבוד ההודעה
};
//DEADLINES

 const handleToggleOptionsDL = () => {
    setShowOptionsDL(!showOptionsDL);
  };
const uploadPdfDeadLines = async () => {
    setIsLoading(true); // הפעלת הטעינה

    const cl = FirebaseClient.getInstance();
    const arrHolder = [];
    if (pdfListDL.length === 5) {
      const deleted = await cl.DeleteDeadLines(pdfListDL[4]);
      if (deleted instanceof Error) {
        alert(deleted.message);
        return;
      }

      for (let i = 0; i < pdfListDL.length; i++) {
        arrHolder.push(pdfListDL[i])
      }
      for (let i = arrHolder.length - 1; i > 0; i--) {
        arrHolder[i] = arrHolder[i - 1];
      }
    }

    const res = await cl.DeadLinesUploadFile(pdfUploadDL);

    if (res instanceof Error) {
      alert(res.message);
    } else {
      const dateUpload = Date.now();
      const dataEntry = { file: res, name: pdfUploadDL.name, date: dateUpload };
      const resEntry = await cl.AppendDeadLinesEntry(dataEntry);

      if (resEntry instanceof Error) {
        alert(resEntry.message);
      } else {
        //do something
        alert("good");
        arrHolder[0] = resEntry;
        if (arrHolder.length === 1)
          setPdfListDL(arrHolder);
        else
          setPdfListDL([resEntry, ...pdfListDL])
      }
    }

    setIsLoading(false); // כיבוי הטעינה לאחר הסיום
  };
  const handlePdfSelectionDL = async (pdf) => {
    setSelectedPdf(pdf);
    setShowOptionsDL(false);
    const storage = FirebaseClient.GetStorage();
    const pdfRef = ref(storage,pdf.file.download_url);
    const url = await getDownloadURL(pdfRef);
    setPdfURLDL(url);
  };
  const deletePdfDL = async (pdf) => {
    const cl = FirebaseClient.getInstance();
    const res = await cl.DeleteDeadLines(pdf);
    if (res instanceof Error)
      alert(res.message);
    else
      setPdfListDL(pdfListDL.filter(deadlines => deadlines._id !== pdf._id));
  }
   useEffect(() => {
    const fetchPDF = async () => {
      try {
        const cl = FirebaseClient.getInstance();
        const res = await cl.GetDeadLines();
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setPdfListDL(res);
          const storage = FirebaseClient.GetStorage();
          const pdfRef = ref(storage, res[0].download_url);
          const url = await getDownloadURL(pdfRef);
          setPdfURLDL(url);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPDF();
  }, []);

  return (
    <div className="main-container">
       <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <Container className="mt-4 text-right">
        <Row className="justify-content-end mb-4">
          <Col xs="auto">
            <button onClick={handleToggleTable} className="btn-custom">
              הצג טבלה
            </button>
          </Col>
          <Col xs="auto">
            <h2>טבלת זמני התפילה</h2>
            <hr className="mb-0.5" />
          </Col>
        </Row>
        {isTableVisible && (
          <Container>
            <Row className="justify-content-end">
              <Col xs="auto">
                <button onClick={handleEditClick} className="btn-custom">
                  {isEditing ? 'סיים עריכה' : 'ערוך טבלה'}
                </button>
              </Col>
            </Row>
            <Table striped bordered>
              <thead>
                <tr>
                  <th style={{ textAlign: 'right' }}>זמן</th>
                  <th style={{ textAlign: 'right' }}>יום</th>
                  {isEditing && <th></th>}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row._id}>
                    <td style={{ textAlign: 'right' }}>
                      {isEditing && isEditingRowId === row.id ? (
                        <input style={{textAlign: 'right'}}
                          type="text"
                          name="time"
                          value={newRowData.time}
                          onChange={handleInputChange}
                          className="form-control"
                          dir="rtl" // Add dir="rtl" here
                           
                        />
                      ) : (
                         <span>{row.time}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isEditing && isEditingRowId === row.id ? (
                        <input
                          type="text"
                          name="day"
                          value={newRowData.day}
                          onChange={handleInputChange}
                          className="form-control"
                          style={{ textAlign: 'right' }}
                          dir="rtl" // Add dir="rtl" here
                        />
                      ) : (
                        <span>{row.day}</span>
                      )}
                    </td>
                    {isEditing && (
                      <td>
                        {isEditingRowId === row.id ? (
                          <Button onClick={handleSaveEdit} variant="success">
                            שמור
                          </Button>
                        ) : (
                          <Button onClick={() => handleEditRow(row.id)} variant="primary">
                            ערוך
                          </Button>
                        )}
                        <Button onClick={() => handleDeleteRow(row._id)} variant="danger" className="ml-2">
                          מחק
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {isEditing && (
                  <tr>
                    <td style={{ textAlign: 'right' }}>
                      <input 
                        type="text"
                        name="time"
                        value={newRowData.time}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        dir="rtl" // Add dir="rtl" here
                      />
                    </td>
                    <td style={{ textAlign: 'right'  }}>
                      <input
                        type="text"
                        name="day"
                        value={newRowData.day}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        dir="rtl" // Add dir="rtl" here
                      />
                    </td>
                    <td>
                      <Button onClick={handleAddRow} variant="success">
                        הוסף
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Container>
        )}
      </Container>

      <Container className="text-center mt-5">
        <Row className="justify-content-end">
          <Col xs="auto">
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <CardHeader title="עלונים אחרים" />
              <CardContent>
                <Button onClick={handleToggleOptions} style={{ width: '100%', marginBottom: '8px' }}>
                  {showOptions ? 'סגור' : 'פתח'}
                </Button>
                <Collapse in={showOptions}>
                  <List>
                    {pdfList.map((pdf) => (
                      <ListItem
                        button
                        key={pdf._id}
                        onClick={async () => await deletePdf(pdf)}
                        selected={selectedPdf && selectedPdf.id === pdf.id}
                        style={{
                          cursor: 'pointer',
                          padding: '8px',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          marginBottom: '8px',
                        }}
                      >
                        <ListItemText primary={pdf.name} />
                        
                        <HiTrash />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </Col>
          <Col xs="auto">
            <h3 style={{ color: 'black', marginBottom: '1rem', marginLeft: 100 }}>להעלות עלון חדש</h3>
            <hr className="mb-0.5" />
            <div>
              <input type="file" onChange={(event) => setPdfUpload(event.target.files[0])} className="form-control-file" />
              <button onClick={uploadPdf} variant="success" className="mt-4 btn-custom" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" role="status" size="sm" style={{ marginRight: '0.5rem' }}>
                    <span className="visually-hidden">טוען...</span>
                  </Spinner>
                ) : (
                  'העלאת PDF'
                )}
              </button>
              <p style={{ marginTop: 10, fontWeight: 'bolder' }}>למחיקת עלון בחר עלון מהרשימה</p>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-end mb-4">
          <Col xs="auto">
            <hr className="mb-0.5" />
          </Col>
        </Row>

          {/* DeadLines */}
          <Row className="justify-content-end">
          <Col xs="auto">
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <CardHeader title="מועדים" />
              <CardContent>
                <Button onClick={handleToggleOptionsDL} style={{ width: '100%', marginBottom: '8px' }}>
                  {showOptionsDL ? 'סגור' : 'פתח'}
                </Button>
                <Collapse in={showOptionsDL}>
                  <List>
                    {pdfListDL.map((pdf) => (
                      <ListItem
                        button
                        key={pdf._id}
                        onClick={async () => await deletePdfDL(pdf)}
                        selected={selectedPdf && selectedPdf.id === pdf.id}
                        style={{
                          cursor: 'pointer',
                          padding: '8px',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          marginBottom: '8px',
                        }}
                      >
                        <ListItemText primary={pdf.name} />
                        
                        <HiTrash />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </Col>
          <Col xs="auto">
            <h3 style={{ color: 'black', marginBottom: '1rem', marginLeft: 100 }}>להעלות מועד חדש</h3>
            <hr className="mb-0.5" />
            <div>
              <input type="file" onChange={(event) => setPdfUploadDL(event.target.files[0])} className="form-control-file" />
              <button onClick={uploadPdfDeadLines} variant="success" className="mt-4 btn-custom" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" role="status" size="sm" style={{ marginRight: '0.5rem' }}>
                    <span className="visually-hidden">טוען...</span>
                  </Spinner>
                ) : (
                  'העלאת PDF'
                )}
              </button>
              <p style={{ marginTop: 10, fontWeight: 'bolder' }}>למחיקת מועד בחר עלון מהרשימה</p>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-end mb-4">
          <Col xs="auto">
            <hr className="mb-0.5" />
          </Col>
        </Row>

    <Row className="justify-content-end mb-4">
        <Col xs="auto">
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
            <CardHeader title="עדכוני הודעות" style={{ textAlign: 'right' }} />
            <CardContent>
              <Button onClick={() => setIsMessageOpen(!isMessageOpen)} variant="contained" color="primary">
                {isMessageOpen ? 'סגור הודעות' : 'הצג הודעות'}
              </Button>
              <Collapse in={isMessageOpen}>
                {/* Pass selectedMessage prop to MessagesList */}
                     <MessagesList
                    messages={messages}
                    handleOpenMessage={handleOpenMessage}
                    handleEditMessage={handleEditMessage} // נעביר גם את הפונקציה handleEditMessage
                    handleDeleteMessage={handleDeleteMessage}
                    selectedMessage={selectedMessage}
                  />
              </Collapse>
            </CardContent>
 {isMessageOpen && (
  <CardContent>
    <div className="add-message" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <div className="input-row">
        <input style={{textAlign: 'right'}} type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="הכנס כותרת" />
        <h4 style={{ marginLeft: '8px' }}>:כותרת</h4>
      </div>
      <div className="input-row" >
       <div className="input-row">
  <textarea
    style={{ textAlign: 'right' }}
    value={newMessage}
    onChange={handleInputChangeMsg}
    placeholder="הכנס הודעה"
    rows={3} // Set the number of rows to display in the textarea
  />
</div>

        <h4 style={{ marginRight: '8px' }}>:הודעה</h4>
      </div>
    </div>
    <div className="button-row"> {/* Move this div to create a separate row */}
      <Button onClick={handleAddMessage} variant="contained" color="primary">
        הוסף
      </Button>
    
      <Button onClick={handleCancelMessage} variant="contained" color="secondary">
        ביטול
      </Button>
      </div>
  </CardContent>
  )}
</Card>





          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Admin;