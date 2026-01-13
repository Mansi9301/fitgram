import React, { useState, useEffect } from 'react';
import Post from './Post';
import toast from 'react-hot-toast';
import axios from 'axios';

import '../styles/Post.css';
import HorizontalUserStories from './UsersStories';
import AddPost from './AddPost';

function AllPosts({ posts, users, fetchPosts }) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1100);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/posts/${postId}/like`);
      if (response.data.success) {
        fetchPosts(); // Refresh posts after a like
      }
    } catch (error) {
      toast.error("Error liking post", { position: 'top-center' });
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
        fetchPosts(); // Refresh posts after a comment
      }
    } catch (error) {
      toast.error("Error commenting on post", { position: 'top-center' });
    }
  };

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1100);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="posts-main-container">
      <HorizontalUserStories users={users} />

      {/* Display AddPost only on smaller screens */}
      {!isLargeScreen && <AddPost />}

      <h2>Latest Posts</h2>

      <div className='posts'>
        {loadingPosts ? (
          <h5>Loading...</h5>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} onLike={() => handleLike(post._id)} onComment={handleComment} />
          ))
        ) : (
          <h5 style={{ margin: "auto" }}>No posts available!</h5>
        )}
      </div>
    </div>
  );
}

export default AllPosts;
