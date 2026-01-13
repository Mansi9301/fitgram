// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Providers from './redux/Providers';

import './App.css';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import Home from './screens/Home';

import axios from 'axios';
import { Toaster } from 'react-hot-toast';

axios.defaults.withCredentials = true;
function App() {
  
  return (
    <Router>
      <Providers>

      <div className="App">

      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </Providers>
      <Toaster
  position="top-center"
/>
    </Router>
  );
}

export default App;
