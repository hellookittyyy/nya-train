import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Success from './pages/Success';
import MyTickets from './pages/MyTickets';
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/:trainId" element={<Booking />} />
        <Route path="/success" element={<Success />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
