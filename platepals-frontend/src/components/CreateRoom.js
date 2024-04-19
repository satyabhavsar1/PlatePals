import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CreateRoom = () => {
    const [isLocked, setIsLocked] = useState(false);
    const [roomCode, setRoomCode] = useState(localStorage.getItem('code'));
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        // Fetch friends list when component mounts
        fetchFriendsList();
    }, [roomCode]);

    const fetchFriendsList = () => {
        if (!roomCode) return; // If no room code, don't fetch
        const url = `http://localhost:8000/api/fetch_members/?code=${roomCode}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setFriendsList(data.names);
        })
        .catch((error) => {
            console.error('Error fetching friends list: ', error);
        });
    };

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
            <Button variant="contained" color="primary" onClick={fetchFriendsList} style={{ marginRight: '10px' }}>
                Refresh Friends List
            </Button>
            <Button variant="contained" onClick={handleLockRoom}>
                {isLocked ? 'Unlock Room' : 'Lock Room'}
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
        </Box>
    );
};

export default CreateRoom;
