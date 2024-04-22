import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Snackbar, SnackbarContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // Default to success
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setRoomCode(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Validation: Check if roomCode is empty or not a 6-digit number
        if (!/^\d{6}$/.test(roomCode)) {
            setSnackbarType('error');
            setSnackbarMessage('Please enter a 6-digit numeric room code.');
            setOpenSnackbar(true);
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
        }).then((response) => {
            return response.json(); // Parse the JSON response
        }).then((data) => {
            // Handle the response data
            if (data.success) {
                setSnackbarType('success');
                setSnackbarMessage(data.message);
                navigate('/flashcards/')
            }
            else {
                setSnackbarType('error');
                setSnackbarMessage(data.error);
            }
            setOpenSnackbar(true);
        }).catch((error) => {
            console.error('Error joining room:', error);
            setSnackbarType('error');
            setSnackbarMessage('An error occurred while joining the room.');
            setOpenSnackbar(true);
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
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: snackbarType === 'error' ? '#f44336' : '#4caf50' }}
                    message={snackbarMessage}
                    action={
                        <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                            Close
                        </Button>
                    }
                />
            </Snackbar>
        </Box>
    );
};

export default JoinRoom;
