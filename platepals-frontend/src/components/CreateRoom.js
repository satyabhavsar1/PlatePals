// src/components/CreateRoom.js
import React, { useState } from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';

const CreateRoom = () => {
    const [formData, setFormData] = useState({
        // Initialize form data fields
        field1: '',
        field2: '',
        // Add more fields as needed
      });
    
    // Generate a unique 6 digit code
    const generateUniqueCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        return code;
    };

    fetch('http://localhost:8000/api/cosine_sim/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert('Form submitted successfully!');
        // Optionally, reset the form fields after successful submission
        setFormData({
          field1: '',
          field2: '',
          // Reset other fields as needed
        });
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });

    const [isLocked, setIsLocked] = useState(false); // State variable to track if the room is locked
    const [roomCode] = useState(generateUniqueCode()); // State variable to store room code

    const handleLockRoom = () => {
        // Logic for locking/unlocking the room
        setIsLocked(!isLocked);
    };

    const handleViewFriends = () => {
        // Logic for viewing friends in the room
        console.log("Viewing friends...");
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Your Room Code:
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h3" gutterBottom>
                    {roomCode}
                </Typography>
            </Paper>
            <Button variant="contained" color="primary" onClick={handleViewFriends} style={{ marginRight: '10px' }}>
                View Friends in Room
            </Button>
            <Button variant="contained" onClick={handleLockRoom}>
                {isLocked ? 'Unlock Room' : 'Lock Room'}
            </Button>
        </Box>
    );
};

export default CreateRoom;
