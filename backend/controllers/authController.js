const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');
const fs=require('fs');


const storage = multer.diskStorage({
  destination: './uploads/users',
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage }).single('profilePic');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
 
  if(!username || !email || !password){
    return res.status(400).json({success:false, message: 'Please enter all fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ success: false, message: "User already exists" });
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.status(201).json({success:true, message: 'User registered' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).json({ success: false, message: "Provide email and password" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ success: false, message: "Invalid Email or Password !" });
  }

  // Validate password
  const validate = await bcrypt.compare(password, user.password);
  if (!validate) {
    return res.status(200).json({ success: false, message: "Invalid Email or Password !" });
  }
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "10h", // 10 hours
  });

  // Set cookie with JWT token
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 36000), // 10 hours
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({ success: true, message:user  });
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
   
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProfilePic = async (req, res) => {
 upload(req, res, async () => {
  try {
    const user = await User.findById(req.user.id); // Assuming you have authentication middleware to set `req.user.id`
    if(user?.profilePic && user.profilePic !== undefined){
      fs.unlinkSync(path.join(__dirname,`../uploads/users/${user.profilePic}`)); // Delete old profile picture
    }
    // Update profilePic field with new image path
    user.profilePic =req.file.filename;
    await user.save();
    res.json({success:true,message:user});
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
})
}
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    return res.status(200).json({ success: true,message: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({"user":req.user.id}).populate('user').populate('comments.user', 'username')
    .sort({ createdAt: 'desc' })
    ;
    if (!posts) {
      return res.status(404).json({success:false, message: 'User not found' });
    }
    return res.status(200).json({success:true,message: posts });  
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 
exports.logout = asyncHandler(
  asyncHandler(async (req, res) => {
    res.clearCookie('token')
    req.cookies.token = ''
    res.status(200).json({ "success": true, "message": "logout successfully" })
  })
);
