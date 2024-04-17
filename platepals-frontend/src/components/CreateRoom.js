import React, { useState } from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';

const CreateRoom = () => {
    const [isLocked, setIsLocked] = useState(false); 
    const roomCode = localStorage.getItem('code'); // Retrieve room code from localStorage

    const handleLockRoom = () => {
        // Logic for locking/unlocking the room
        fetch('http://localhost:8000/api/update_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'code': roomCode, 'is_locked': !isLocked}),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setIsLocked(!isLocked);
        })
        .catch((error) => {
            console.error('Error locking room: ', error);
        });

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
                    {roomCode} {/* Display room code */}
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
