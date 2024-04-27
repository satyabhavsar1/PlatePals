import { Button, TextField, Typography, Grid, Paper, Box, Snackbar, SnackbarContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/room.css'

const Dashboard = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsValid(firstName.trim().toLowerCase() !== '' && lastName.trim().toLowerCase() !== '');
    }, [firstName, lastName]);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        const lastNameLower =  lastName.trim().toLowerCase();
        localStorage.setItem('userData', JSON.stringify({ firstName: event.target.value.trim().toLowerCase(), lastNameLower }));
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        const firstNameLower = firstName.trim().toLowerCase();
        localStorage.setItem('userData', JSON.stringify({ firstNameLower, lastName: event.target.value.trim().toLowerCase() }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCreateSubmit = () => {
        if (!isValid) return; // Prevent submission if fields are not valid
        const firstNameLower = firstName.trim().toLowerCase();
        const lastNameLower =  lastName.trim().toLowerCase();

        localStorage.setItem('userData', JSON.stringify({ firstNameLower, lastNameLower }));
        const formData = {
            first_name: firstNameLower,
            last_name: lastNameLower,
        };

        // Make API call to create room
        fetch('http://localhost:8000/api/create_room/', {
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
                localStorage.setItem('code', data.code);
                console.log('Room code:', data.code);
                console.log('roomcode in dashboard', data);
                navigate('/room/create');
            }
            else {
                setErrorMessage(data.error);
                setOpenSnackbar(true);
            }
        }).catch((error) => {
            console.error('Error creating room:', error);
        });
    };

    const handleJoinSubmit = () => {
        if (!isValid) return; // Prevent submission if fields are not valid
        const firstNameLower = firstName.trim().toLowerCase();
        const lastNameLower =  lastName.trim().toLowerCase();

        localStorage.setItem('userData', JSON.stringify({ firstName, lastName }));
        const formData = {
            first_name: firstNameLower,
            last_name: lastNameLower,
        };

        // Make API call to create room
        fetch('http://localhost:8000/api/join_room_check_user/', {
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
                navigate('/room/join');
            }
            else {
                setErrorMessage(data.error);
                setOpenSnackbar(true);
            }
        }).catch((error) => {
            console.error('Error creating room:', error);
        });
    };


    return (
        <div className = 'room-div'>
        <Box p={3} >
            <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia'}}>
                Dashboard
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', maxWidth: '300px' }}>
                <Typography variant="body1" gutterBottom style={{fontWeight: 'bold', color: '#000000' }}>
                    Welcome to your dashboard. Please enter your information below.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            required
                            id="outlined-required-firstName"
                            label="First Name"
                            variant="filled"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            InputLabelProps={{
                                style: { color: '#000000' }, 
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            required
                            id="outlined-required-lastName"
                            label="Last Name"
                            variant="filled"
                            value={lastName}
                            onChange={handleLastNameChange}
                            InputLabelProps={{
                                style: { color: '#000000' }, 
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Box display={isValid ? 'flex' : 'none'} justifyContent="space-between">
            <Button variant="contained" color="inherit" style={{ marginRight: '10px', marginLeft: '5px', backgroundColor: '#f9604c', color: '#ffffff'}} onClick={handleJoinSubmit}>
                Join a Room
            </Button>
            <Button variant="contained" color="inherit" style={{ marginRight: '10px', marginLeft: '5px', backgroundColor: '#f9604c', color: '#ffffff' }} onClick={handleCreateSubmit}>
                Create a Room
            </Button>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <SnackbarContent
                    style={{ backgroundColor: '#ec5c38' }}
                    message={errorMessage}
                    action={
                        <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                            Close
                        </Button>
                    }
                />
            </Snackbar>
        </Box>
        </div>
    );
}

export default Dashboard;
