import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, SnackbarContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './css/room.css'
import config from '../Config/config.js';

const apiUrl = config.apiUrl;
const CreateRoom = () => {
    const [isLocked, setIsLocked] = useState(false);
    const [roomCode, setRoomCode] = useState(localStorage.getItem('code'));
    const [friendsList, setFriendsList] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch friends list when component mounts
        fetchFriendsList();
    }, [roomCode]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const fetchFriendsList = () => {
        if (!roomCode) return; // If no room code, don't fetch
        const url = apiUrl+`api/fetch_members/?code=${roomCode}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            return response.json(); // Parse the JSON response
        }).then((data) => {
            // Handle the response data
            if (data.success) {
                setFriendsList(data.names);
                setSnackbarType('success');
                setSnackbarMessage("Friends list updated successfully");
                setOpenSnackbar(true);
            }
            else {
                setSnackbarType('error');
                setSnackbarMessage(data.error);
                setOpenSnackbar(true);
            }
        }).catch((error) => {
            console.error('Error fetching friends list: ', error);
            setSnackbarType('error');
            setSnackbarMessage('Error fetching friends list');
            setOpenSnackbar(true);
        });
    };

    const handleLockRoom = () => {
        // Logic for locking/unlocking the room
        fetch(apiUrl+'api/update_room/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'code': roomCode, 'is_locked': !isLocked }),
        }).then((response) => {
            return response.json(); // Parse the JSON response
        }).then((data) => {
            // Handle the response data
            if (data.success) {
                setSnackbarType('success');
                setSnackbarMessage(data.message);
                setIsLocked(!isLocked);
            }
            else {
                setSnackbarType('error');
                setSnackbarMessage(data.error);
            }
            setOpenSnackbar(true);
        }).catch((error) => {
            console.error('Error updating room: ', error);
            setSnackbarType('error');
            setSnackbarMessage('Error updating room');
            setOpenSnackbar(true);
        });
    };

    const handleStart = () => {
        if (isLocked) {
          // Navigate to "/flashcards"
          navigate('/flashcards');
        }
      };
        return (
        <div className = 'room-div'>
        <Box p={3}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia'}}>
                Your Room Code:
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h3" gutterBottom>
                    {roomCode} {/* Display room code */}
                </Typography>
            </Paper>
            <Button variant="contained" color="primary" onClick={fetchFriendsList} style={{ marginRight: '10px', marginLeft: '5px', marginBottom: '10px', backgroundColor: '#f9604c', color: '#ffffff'}}>
                Refresh Friends List
            </Button>
            <Button variant="contained" onClick={handleLockRoom} style={{ marginRight: '10px', marginLeft: '5px',  marginBottom: '10px', backgroundColor: '#f9604c', color: '#ffffff'}}>
                {isLocked ? 'Unlock Room' : 'Lock Room'}
            </Button>
            <Button variant="contained" onClick={handleStart} disabled={!isLocked} style={{ marginRight: '10px', marginLeft: '5px',  marginBottom: '10px', backgroundColor: '#f9604c', color: '#ffffff'}}>
                Start
            </Button>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {friendsList.map((names, index) => (
                            <TableRow key={index}>
                                <TableCell>{names[0]}</TableCell>
                                <TableCell>{names[1]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
        </div>
    );
};

export default CreateRoom;
