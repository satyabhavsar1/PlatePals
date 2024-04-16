import React, { useState } from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';

const CreateRoom = () => {
    // Generate a unique 6 digit code
    const generateUniqueCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        return code;
    };
    
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
    const userData = JSON.parse(localStorage.getItem('userData'));
    const { firstName, lastName } = userData;
    
    const handleCreateUser = () => {
        // Construct formData object including firstName and lastName
        const formData = {
            first_name: firstName,
            last_name: lastName,
            // Add more fields as needed
        };

        // Make API call to create user
        fetch('http://localhost:8000/api/create_user/', {
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
            alert('User created successfully!');
        })
        .catch((error) => {
            console.error('Error creating user:', error);
        });
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
            <Button variant="contained" color="primary" onClick={handleCreateUser}>
                Create User
            </Button>
        </Box>
    );
};

export default CreateRoom;
