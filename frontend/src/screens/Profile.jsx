import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProtectedRoute from '../components/PrivatePage';
import Post from '../components/Post';
import axios from 'axios';
import { setdata } from '../redux/reducers/userSlice';

function Profile() {
  const [posts, setPosts] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewProfilePic, setPreviewProfilePic] = useState(null); // For displaying the preview
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users.userdata);

  const fetchPosts = async () => {
    try {
      setPosts([]);
      const response = await axios.get('http://localhost:8000/api/auth/userPosts');
      if (response.data.success) {
        setPosts(response.data.message);
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/posts/${postId}/like`);
      if (response.data.success) {
        fetchPosts();
      } else {
        toast.error(response.data.message, { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Error liking post', { position: 'top-center' });
    }
  };

  const handleComment = async (postId, comment) => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty', { position: 'top-center' });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, { comment });
      if (response.data.success) {
        fetchPosts();
      } else {
        toast.error(response.data.message, { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Error commenting on post', { position: 'top-center' });
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);
    setPreviewProfilePic(URL.createObjectURL(file)); // Generate preview URL for the selected image
  };

  const handleProfilePicUpdate = async () => {
    if (newProfilePic) {
      const formData = new FormData();
      formData.append('profilePic', newProfilePic);

      try {
        const response = await axios.put('http://localhost:8000/api/auth/updateProfilePic', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.success) {
          dispatch(setdata(response.data.message)); // Update user data with the new profile picture
          toast.success('Profile picture updated successfully!');
        } else {
          toast.error(response.data.message, { position: 'top-center' });
        }
      } catch (error) {
        toast.error('Error updating profile picture');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-pic-container">
            <img
              src={previewProfilePic ? previewProfilePic : userData.profilePic ? `http://localhost:8000/uploads/users/${userData.profilePic}` : 'http://localhost:8000/uploads/images/user.png'}
              alt="Profile"
              className="profile-pic"
              onClick={() => document.getElementById('profilePicInput').click()} // Click to select a new profile picture
            />
            <input type="file" id="profilePicInput" style={{ display: 'none' }} onChange={handleProfilePicChange} />
          </div>
          <div className="profile-info">
            <h3>{userData.username}</h3>
            <p className="profile-email">{userData.email}</p>
            <div className="buttons-container">
              <button className="update-btn" onClick={handleProfilePicUpdate}>Update Profile Picture</button>
            </div>
          </div>
        </div>
        <div className="user-posts">
          <h3>Your Posts</h3>
          {posts.length === 0 ? (
            <p style={{textAlign:"center"}}>You have not posted anything yet!</p>
          ) : (
            posts.map((post) => (
              <Post key={post._id} post={post} onLike={() => handleLike(post._id)} onComment={handleComment} />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Profile;
