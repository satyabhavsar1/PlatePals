import React from 'react';
import './css/loading.css';
import { useState, useMemo, useRef } from 'react'
import { Typography, Button, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, SnackbarContent } from '@mui/material';

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
    <section className="loading-page">
    {result === '' && (
                    <>
                        <div>
                            <p>Loading</p>
                        </div>
                        <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleRefresh}>
                            Refresh
                        </Button>
                    </>
                )}        
         {result !== '' && (
                <div>
                    <p>{result}</p>
                    <p>Address:{resultAddress}</p>
                </div>
            )}
    </section>
  );
}

export default Loading;
