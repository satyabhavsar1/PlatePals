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
        event.preventDefault();
    
        // Validation: Check if roomCode is empty or not a 6-digit number
        if (!/^\d{6}$/.test(roomCode)) {
            alert('Please enter a 6-digit numeric room code.');
            return;
        }
    
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        const { firstName, lastName } = userData;
    
        const formData = {
            first_name: firstName,
            last_name: lastName,
            code: roomCode,
        };
    
        fetch('http://localhost:8000/api/add_member_to_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then((response) => {
            if (!response.ok) {
                if (response.headers.get('content-type')?.includes('application/json')) {
                    return response.json().then(errorResponse => {
                        throw new Error(errorResponse.error || 'Unknown error occurred');
                    });
                }
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('code', data.code);
            console.log('Room code:', data.code);
            console.log('roomcode in dashboard', data);
        })
        .catch((error) => {
            console.error('Error joining room:', error);
            if (error.message) {
                alert(error.message);
            } else {
                alert('An error occurred while joining the room.');
            }
        });
    
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
