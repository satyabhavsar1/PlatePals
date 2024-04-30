import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import FlashCards from './components/FlashCards'; 
import Loading from './components/Loading';

  // "start:l": "REACT_APP_ENV=localhost react-scripts start",
    // "start:lw": "SET REACT_APP_ENV=localhost&& react-scripts start",
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/join" element={<JoinRoom />} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/loading" element={<Loading/>} />
      </Routes>
    </Router>
  );
}

export default App;

