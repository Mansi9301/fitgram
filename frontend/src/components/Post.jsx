import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaUserCircle, FaPaperPlane } from 'react-icons/fa'; // Add FaPaperPlane icon
import '../styles/Post.css';

function Post({ post, onLike, onComment }) {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onComment(post._id, comment);
      setComment('');
    } else {
      console.error('Comment cannot be empty');
    }
  };

  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-details">
          <div className="post-header">
            {post.user.profilePic ? (
              <img
                src={`http://localhost:8000/uploads/users/${post.user.profilePic}`}
                alt="Profile"
                className="profile-picc"
              />
            ) : (
              <FaUserCircle className="user-icon" />
            )}
            <div className="post-user-info">
              <p className="post-username">{post.user.username}</p>
            </div>
          </div>
          <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
          {post.image && (
            <img
              src={`http://localhost:8000/uploads/posts/${post.image}`}
              alt="Post"
              className="post-image"
            />
          )}
          <p className="post-text">{post.text}</p>
          <div className="post-actions">
            <button onClick={onLike} className="like-button">
              <FaThumbsUp /> {post.likes.length} Likes
            </button>
          </div>
          <div className="comment-section">
            <input
              type="text"
              value={comment}
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
            />
            <FaPaperPlane onClick={handleCommentSubmit} className="comment-icon" />
          </div>
          <div className="post-comments">
            {post.comments.map((c, index) => (
              <p key={index} className="comment">
                <strong>{c.user.username}:</strong> {c.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
