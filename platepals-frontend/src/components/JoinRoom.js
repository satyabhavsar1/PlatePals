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
        const userDataString = localStorage.getItem('userData');

        // Parse the stringified JSON into a JavaScript object
        const userData = JSON.parse(userDataString);

        // Extract firstName and lastName
        const { firstName, lastName } = userData;


        console.log(userData)
        const formData = {
            first_name: firstName,
            last_name: lastName,
            code: roomCode,
        };
        console.log(formData)

        // Make API call to add member to room
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
                    // If it does, parse the JSON response and throw the error message
                    return response.json().then(errorResponse => {
                      throw new Error(errorResponse.error || 'Unknown error occurred');
                    });
                }
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            // Handle the response data
            localStorage.setItem('code', data.code);
            console.log('Room code:', data.code);
            console.log('roomcode in dashboard', data);
        })
        .catch((error) => {
            console.error('Error joining room:', error);
            // Access the error message from the response
            if (error!="") {
                // Alert the error message
                alert(error);
            } else {
                // If the error message is not available, alert a generic message
                alert('An error occurred while joining the room.');
            }
        });
        
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
