import React from 'react';
import "../styles/UsersStories.css";

function HorizontalUserStories({ users }) {
  return (
    <div className="horizontal-user-stories">
      {/* Static '+' story circle */}
      <div className="story add-story">
        <div className="add-icon">+</div>
        <p className="story-username">Add Story</p>
      </div>

      {/* User story circles */}
      {users && users.map((user, index) => (
        <div key={index} className="story">
          <img
            src={user.profilePic ? `http://localhost:8000/uploads/users/${user.profilePic}` : 'http://localhost:8000/uploads/images/user.png'}
            alt="profile"
            className="story-avatar"
          />
          <p className="story-username">{user.username}</p>
        </div>
      ))}
    </div>
  );
}

export default HorizontalUserStories;
