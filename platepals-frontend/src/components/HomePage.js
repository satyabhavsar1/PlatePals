import React from 'react';
// import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './../css/HomePage.css';
import Button from '@mui/material/Button';

const HomePage = () => {
    return (
      <div className="home-container">
        <h1 className="home-title">Welcome to PlatePals!</h1>
        <p className="home-subtitle">Let's begin your culinary journey.</p>
        {/* <Link to="/dashboard" className="home-link">Start Exploring</Link> */}
        <Button variant="contained" href="/dashboard">Let's Begin </Button>
      </div>
    );
  }
  
  export default HomePage;