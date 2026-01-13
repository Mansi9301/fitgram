import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/PrivatePage';
import AddPost from '../components/AddPost';
import AllPosts from '../components/AllPosts';
import axios from 'axios';
import toast from 'react-hot-toast';
import AllUsers from '../components/AllUsers';

function Home() {
  const [posts, setPosts] = useState(null);
  const [users, setUsers] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1100);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts');
      if (response.data.success) {
        setPosts(response.data.message);
        setLoadingPosts(false);
      }
    } catch (error) {
      toast.error("Error fetching posts", { position: 'top-center' });
      setLoadingPosts(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users');
      if (response.data.success) {
        setUsers(response.data.message);
        setLoadingUsers(false);
      }
    } catch (error) {
      toast.error("Error fetching users", { position: 'top-center' });
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();

    const handleResize = () => setIsLargeScreen(window.innerWidth > 1100);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <ProtectedRoute>
      <div className='home_container'>
        {loadingUsers ? "Loading users..." : isLargeScreen && <AllUsers users={users} />}
        {loadingPosts ? "Loading posts..." : <AllPosts users={users} posts={posts} fetchPosts={fetchPosts} />}
        {isLargeScreen && <AddPost />}
      </div>
    </ProtectedRoute>
  );
}

export default Home;
