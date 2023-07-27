import React, { useEffect, useState } from 'react';
import { Container, Button, Table,} from 'react-bootstrap';
import FirebaseClient from '../api/FirebaseClient';
import { toast } from 'react-toastify';
import forest from '../pics/forest.png';
import  '../css/Main.css';


function TimesPray(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRowId, setIsEditingRowId] = useState(null);
  const [newRowData, setNewRowData] = useState({ time: '', day: '' });
  const [tableData, setTableData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
 useEffect(() => {
  const handleScroll = () => {
    const backgroundContainer = document.querySelector('.background-container');
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Calculate the scroll amount and adjust the background image position
      const scrollPosition = window.scrollY;
      backgroundContainer.style.transform = `translateY(-${scrollPosition}px)`;
    }
  };
  

  // Attach the scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Clean up the listener when the component unmounts
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
  const fetchData = async () => {
    const cl = FirebaseClient.getInstance();

    const res = await cl.GetPrayingTimes();

    if (res instanceof Error) toast.error(res.message);
    else setTableData(res.map((entry,index) => ({...entry, id: index})).sort((x,y) => x.created_at > y.created_at));

  };

  useEffect(() => {
    fetchData();
  }, []);

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
  const res = await cl.UpdatePrayingTime(newRowData);
  if (res instanceof Error) toast.error(res.message);
  else {
    const updatedTableData = tableData.map((row) =>
      row.id === isEditingRowId ? { ...newRowData, id: row.id } : row
    );
    setTableData(updatedTableData);
    setIsEditingRowId(null);
    setNewRowData({ time: '', day: '' });
  }
};

  const handleDeleteRow = async (id) => {
    const cl = FirebaseClient.getInstance();
    const res = await cl.DeletePrayingTime(id);
    if (res instanceof Error) toast.error(res.message);
    else {
      const updatedTableData = tableData.filter((row) => row._id !== id);
      setTableData(updatedTableData);
    }
  };

 const handleAddRow = async () => {
  const cl = FirebaseClient.getInstance();
  const newRow = newRowData;

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




  return (
    <div className="main-container">
           <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>
       <div className='content'>
        
      <Container className="mt-4 text-right">
              <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: '1px',
    }}
  >
    <div className='tracking-in-expand-fwd-top'>
    <h1
      style={{
        fontSize: '5rem',
        fontWeight: 'bold',
        margin: 0,
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.7), 0 0 3px rgba(0, 0, 0, 0.9), 0 0 3px rgba(0, 0, 0, 0.9), 0 0 3px rgba(0, 0, 0, 0.9), 0 0 3px rgba(0, 0, 0, 0.9)',
        textTransform: 'uppercase',
        letterSpacing: '2px',

        padding: '10px',
      }}
    >
      זמני תפילות
    </h1>
    </div>
 
    
    </div>
      </Container>
    <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            
          }}
        >
        <Table striped bordered style={{ width: '100%' }}>
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '70%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>זמן</th>
              <th style={{ textAlign: 'center' }}>יום</th>
              
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center' }}>
                  {isEditing && isEditingRowId === row.id ? (
                    <input
                      type="text"
                      name="time"
                      value={newRowData.time}
                      onChange={handleInputChange}
                    />
                  ) : (
                    row.time
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {isEditing && isEditingRowId === row.id ? (
                    <input
                      type="text"
                      name="day"
                      value={newRowData.day}
                      onChange={handleInputChange}
                    />
                  ) : (
                    row.day
                  )}
                </td>
                {isEditing ? (
                  <td>
                    {isEditingRowId === row.id ? (
                      <Button onClick={handleSaveEdit}>שמור</Button>
                    ) : (
                      <Button onClick={() => handleEditRow(row.id)}>ערוך</Button>
                    )}
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => handleDeleteRow(row._id)}
                    >
                      מחק
                    </Button>
                  </td>
                ) : null}
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
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <input
                    type="text"
                    name="day"
                    value={newRowData.day}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <Button onClick={handleAddRow}>הוסף</Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        </div>
      </div>
    </div>
  );
}

export default TimesPray;
