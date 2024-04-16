// src/components/JoinRoom.js
import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState('');

    const handleInputChange = (event) => {
        // Update the room code state when input changes
        setRoomCode(event.target.value);
    };

    const handleSubmit = (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Logic to handle joining the room with the entered room code
        console.log("Joining room with code:", roomCode);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Join Room
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Enter Room Code"
                    variant="outlined"
                    value={roomCode}
                    onChange={handleInputChange}
                    style={{ marginBottom: '20px' }}
                />
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default JoinRoom;
