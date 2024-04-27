import React from 'react';
// import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './css/HomePage.css'
import Button from '@mui/material/Button';

const HomePage = () => {
    return (
      <div className="home-container">
        <h1 className="home-title">Welcome to PlatePals!</h1>
        <p className="home-subtitle">Dine Together...</p>
        {/* <Link to="/dashboard" className="home-link">Start Exploring</Link> */}
        <Button style={{ backgroundColor: '#f9604c', color: '#ffffff' }} variant="contained" href="/dashboard">Let's Begin </Button>
      </div>
    );
  }
  
  export default HomePage;