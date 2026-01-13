import React, { useState } from 'react';
import axios from 'axios';
import '../styles/register.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import toast from 'react-hot-toast';

import loader from "../assets/loader/loader.gif";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!username || !email || !password) {
        return toast.error("Please fill in all fields", { position: 'top-center' });
      }
      setLoading(true);

      const response = await axios.post('http://localhost:8000/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.success === true) {
        toast.success("Congratulations! 🎉 Your registration is complete.", { position: 'top-center' });
        setEmail('');
        setUsername('');
        setPassword('');
        navigate("/login");
      } else {
        toast.error(response.data.message, { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Internal server error occurred!', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter Your Name here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Your Email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {loading ? (
            <img src={loader} style={{ width: "50px", height: "50px" }} alt="loader" />
          ) : (
            <button type="submit">Register</button>
          )}
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
