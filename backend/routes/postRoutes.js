const express = require('express');
const router = express.Router();
const { createPost,getAllPosts, likePost, commentPost, getRecommendedPosts } = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createPost).get('/',getAllPosts);
router.get('/recommended-posts', auth, getRecommendedPosts);
router.put('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);
module.exports = router;
