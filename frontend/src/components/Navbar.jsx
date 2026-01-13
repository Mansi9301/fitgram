// src/components/Navbar.js

import React, { useState } from 'react';
import "../styles/Navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setdata, setisLoggedin } from '../redux/reducers/userSlice';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);
    
    
    const logouthandler = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post('http://localhost:8000/api/auth/logout');
            if (res.data.success) {
                toast.success("Logout Successfully");
                dispatch(setisLoggedin(false));
                dispatch(setdata(null));
                navigate("/login");
            } else {
                toast.error('Something went wrong!');
            }
        } catch (e) {
            toast.error("Something went wrong");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/Hero">Fitgram</Link>
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <FaBars />
            </button>
            <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                {users?.isloggedin ? (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <img onClick={() => navigate("/profile")} 
                             src={users?.userdata?.profilePic ? `http://localhost:8000/uploads/users/${users?.userdata?.profilePic}` : 'http://localhost:8000/uploads/images/user.png'} 
                             alt="profile" className="navbar_avatar" />  
                        <button onClick={logouthandler} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
