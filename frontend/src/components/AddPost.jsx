import React, { useEffect, useState } from 'react';
import '../styles/createPost.css';
import { FaPlus, FaImage } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import Post from './Post';


function AddPost() {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [posts, setPosts] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1100);
    const [loadingPosts, setLoadingPosts] = useState(true);
  
    const getRecommendedPosts = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/posts/recommended-posts');
          if (response.data.success) {
            setPosts(response.data.message);
            setLoadingPosts(false);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error("Error fetching recommended posts");
          setLoadingPosts(false);
        }
      };

      const handleLike = async (postId) => {
        try {
          const response = await axios.put(`http://localhost:8000/api/posts/${postId}/like`);
          if (response.data.success) {
            getRecommendedPosts(); // Refresh posts after a like
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
            getRecommendedPosts(); // Refresh posts after a comment
          }
        } catch (error) {
          toast.error("Error commenting on post", { position: 'top-center' });
        }
      };

      const handleCreatePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', text);
        if (image) formData.append('image', image);
    
        try {
          const response = await axios.post('http://localhost:8000/api/posts', formData);
          if (response.data.success) {
            toast.success("Post Created Successfully");
            getRecommendedPosts();
            setText('');
            setImage(null);
            setImagePreview(null);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error("Error creating post");
        }
      };
    
      const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      };
    
      const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
      });
    
      useEffect(() => {
        getRecommendedPosts();
    
        const handleResize = () => setIsLargeScreen(window.innerWidth > 1100);
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
      return (
        <div className="add-post-container">
          <div className='add-post-sticky'>
            <form className="create-post" onSubmit={handleCreatePost}>
              <h2 className="section-title">Create Post</h2>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="post-input"
              />
              
              {/* Custom Upload Section */}
              <div {...getRootProps()} className="upload-section">
                <input {...getInputProps()} />
                <FaImage className="upload-icon" />
                <p className="upload-text">{image ? "Image selected" : "Drag & drop an image, or click to select"}</p>
              </div>
              
              {/* Display image preview if available */}
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              
              <button type="submit" className="submit-button">
                <FaPlus /> Post
              </button>
            </form>
    
            {/* Recommended Posts Section */}
            {isLargeScreen && (
              <div className="recommended-posts">
                <h2 className="section-title">Recommended Posts</h2>
                {loadingPosts ? (
                  <p>Loading...</p>
                ) : posts.length === 0 ? (
                  <p style={{ textAlign: "center" }}>No posts to show!</p>
                ) : (
                  posts.map((post) => (
                    <Post key={post._id} post={post} onLike={() => handleLike(post._id)} onComment={handleComment} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    export default AddPost;