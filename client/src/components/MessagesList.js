import React, { useState } from 'react';
import { List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { HiTrash } from 'react-icons/hi';

const MessagesList = ({ messages, handleOpenMessage, handleEditMessage, handleDeleteMessage, selectedMessage }) => {
  const [editedMessages, setEditedMessages] = useState({});
  const [isTitleEditing, setTitleEditing] = useState(false);

  const handleEdit = (index) => {
    setEditedMessages((prev) => ({ ...prev, [index]: { ...messages[index] } }));
    setTitleEditing(true);
  };

  const handleSave = (index) => {
    if (editedMessages[index]) {
      handleEditMessage(index, editedMessages[index]);
      setEditedMessages((prev) => ({ ...prev, [index]: undefined }));
      setTitleEditing(false);
    }
  };

  return (
    <List>
      {messages.map((message, index) => (
        <ListItem key={message.id}>
          <HiTrash onClick={() => handleDeleteMessage(message.id)} style={{ marginRight: '8px' }} />
          <div style={{ flex: 1 }}>
            <ListItemText
              primary={
                <>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', textAlign: 'right' }}>
                    <h4 style={{ textAlign: 'right', borderBottom: '1px solid #ccc', flex: 1 }}>
                      {isTitleEditing && editedMessages[index] ? (
                        <TextField
                          fullWidth
                          value={editedMessages[index].title}
                          onChange={(e) =>
                            setEditedMessages((prev) => ({
                              ...prev,
                              [index]: { ...prev[index], title: e.target.value },
                            }))
                          }
                          inputProps={{ style: { textAlign: 'right' } }} // Set text direction to right-to-left
                          style={{ backgroundColor: isTitleEditing ? 'white' : 'transparent' }}
                        />
                      ) : (
                        message.title
                      )}
                    </h4>
                  </div>
                  {editedMessages[index] ? (
                    <TextField
                      fullWidth
                      multiline
                      value={editedMessages[index].message}
                      onChange={(e) =>
                        setEditedMessages((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], message: e.target.value },
                        }))
                      }
                      inputProps={{ style: { textAlign: 'right' } }} // Set text direction to right-to-left
                      style={{ backgroundColor: isTitleEditing ? 'white' : 'transparent' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'right' }}>{message.message}</div>
                  )}
                </>
              }
            />
          </div>
          <div>
            {editedMessages[index] && (
              <Button variant="contained" color="primary" onClick={() => handleSave(index)}>
                שמור
              </Button>
            )}
            {!editedMessages[index] && (
              <button style={{ marginLeft: '10px' }} onClick={() => handleEdit(index)}>
                עריכה
              </button>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default MessagesList;
