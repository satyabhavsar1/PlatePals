import React from 'react';
import './css/loading.css';
import { useState, useMemo, useRef } from 'react'
import { Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, SnackbarContent } from '@mui/material';
import './css/room.css'

const Loading = () => {
    const [roomCode, setRoomCode] = useState(localStorage.getItem('code'));
    const [result, setResult] = useState(''); 
    const [resultAddress, setResultAddress] = useState(''); 
    const handleRefresh = () => {
        const url = `http://localhost:8000/api/fetch_result/?code=${roomCode}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            return response.json(); 
        }).then((data) => {
            if (data.success) {
                console.log(data);
                setResult(data.result.Name);
                setResultAddress(data.result.Address);
            }
           
        }).catch((error) => {
        });
    };


  return (
    <div className = 'room-div'>
    <section className="loading-page">
    {result === '' && (
                    <>
                        <div>
                        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia'}}>
                            Loading
                        </Typography>
                        </div>
                        <Button variant="contained" color="primary" style={{ marginRight: '10px', marginLeft: '5px', backgroundColor: '#f9604c', color: '#ffffff'}} onClick={handleRefresh}>
                            Refresh
                        </Button>
                    </>
                )}        
                {result !== '' && (
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #ced4da' }}>
                    <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia', marginBottom: '10px' }}>
                        Result
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia', marginBottom: '5px' }}>
                        Name: {result}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#f9604c', fontFamily: 'Your Chosen Font, Georgia', marginBottom: '5px' }}>
                        Address: {resultAddress}
                    </Typography>
                </Paper>
            )}




    </section>
    </div>
  );
}

export default Loading;
