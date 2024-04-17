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
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
