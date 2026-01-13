const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfilePic, getUserPosts, logout, getAllUsers } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout)

router.get('/users',auth,getAllUsers);
router.get('/profile', auth, getProfile);
router.put('/updateProfilePic',auth,updateProfilePic);
router.get('/userPosts',auth,getUserPosts);

module.exports = router;