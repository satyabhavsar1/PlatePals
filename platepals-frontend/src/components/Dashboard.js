import { Button, TextField, Typography, Grid, Paper, Box, Snackbar, SnackbarContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsValid(firstName.trim() !== '' && lastName.trim() !== '');
    }, [firstName, lastName]);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        localStorage.setItem('userData', JSON.stringify({ firstName: event.target.value, lastName }));
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        localStorage.setItem('userData', JSON.stringify({ firstName, lastName: event.target.value }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCreateSubmit = () => {
        if (!isValid) return; // Prevent submission if fields are not valid

        localStorage.setItem('userData', JSON.stringify({ firstName, lastName }));
        const formData = {
            first_name: firstName,
            last_name: lastName,
        };

        // Make API call to create room
        fetch('http://localhost:8000/api/create_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // Handle the response data
                if (data.success) {
                    localStorage.setItem('code', data.code);
                    console.log('Room code:', data.code);
                    console.log('roomcode in dashboard', data);
                    navigate('/room/create');
                }
                else {
                    setErrorMessage(data.error);
                    setOpenSnackbar(true);
                }

            })
            .catch((error) => {
                console.error('Error creating room:', error);
            });
    };

    const handleJoinSubmit = () => {
        if (!isValid) return; // Prevent submission if fields are not valid

        localStorage.setItem('userData', JSON.stringify({ firstName, lastName }));
        const formData = {
            first_name: firstName,
            last_name: lastName,
        };

        // Make API call to create room
        fetch('http://localhost:8000/api/join_room_check_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                // Handle the response data
                if (data.success) {
                    navigate('/room/join');
                }
                else {
                    setErrorMessage(data.error);
                    setOpenSnackbar(true);
                }

            })
            .catch((error) => {
                console.error('Error creating room:', error);
            });
    };


    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="body1" gutterBottom>
                    Welcome to your dashboard. Please enter your information below.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            id="outlined-required-firstName"
                            label="First Name"
                            variant="filled"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            id="outlined-required-lastName"
                            label="Last Name"
                            variant="filled"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleJoinSubmit} disabled={!isValid}>
                Join a Room
            </Button>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleCreateSubmit} disabled={!isValid}>
                Create a Room
            </Button>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#f44336' }}
                    message={errorMessage}
                    action={
                        <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                            Close
                        </Button>
                    }
                />
            </Snackbar>
        </Box>
    );
}

export default Dashboard;
