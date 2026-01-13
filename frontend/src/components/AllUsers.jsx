import React, { useState } from 'react';
import "../styles/AllUsers.css";
import ProtectedRoute from './PrivatePage';
import { useSelector } from 'react-redux';

function AllUsers({ users }) {
  const [searchTerm, setSearchTerm] = useState('');
  const userData=useSelector((state)=>state.users.userdata)
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) && user._id !== userData._id
  );

  return (
    <ProtectedRoute>
      <div className="all-users-container">
        <div className="sticky-search">
        <h2>Discover New Friends</h2>
          <input
            type="text"
            placeholder="Search friends..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
       
        <div className="users-grid">
          {filteredUsers.length === 0 ?
          <p>No users found !</p> :
          filteredUsers.map((user, index) => (
            <article key={index} className="user-card">
              <img
                src={user.profilePic ? `http://localhost:8000/uploads/users/${user.profilePic}` : 'http://localhost:8000/uploads/images/user.png'}
                alt="profile"
                className="user-avatar"
              />
              <div className="user-info">
                <h3 className="user-name">{user.username}</h3>
              </div>
            </article>
          ))}
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AllUsers;
