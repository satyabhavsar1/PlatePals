import { Button, TextField, Typography, Grid, Paper, Box } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleSubmit = () => {
        // Optionally, perform form validation before proceeding
        // Store form data in local storage
        localStorage.setItem('userData', JSON.stringify({ firstName, lastName }));
        // Navigate to CreateRoom page
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
            <Button variant="contained" color="primary" href="/room/join" style={{ marginRight: '10px' }}>
                Join a Room
            </Button>
            <Link to="/room/create" style={{ textDecoration: 'none' }}>

                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Create a Room
                </Button>
            </Link>
        </Box>
    );
}

export default Dashboard;
