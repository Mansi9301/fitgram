const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const asyncHandler = require('express-async-handler');

const storage = multer.diskStorage({
  destination: './uploads/posts',
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage }).single('image');

exports.createPost = async (req, res) => {
  upload(req, res, async () => {
    const { text } = req.body;
    if(!text){
      return res.status(400).json({success:false, message: 'Please enter all fields' });
    }else if(!req.file){
      return res.status(400).json({success:false, message: 'Please upload an image' });
    }

    const post = new Post({ user: req.user.id, text, image:req.file.filename });
    await post.save();
    res.status(201).json({success:true, message: 'Post created' });
  });
};

exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);


  if (post.likes.includes(req.user.id)) {
    return res.status(200).json({success:false, message: 'Post already liked' });
  }
    post.likes.push(req.user.id);
  
  await post.save();
  res.json({ success: true, message: 'Post liked' });
};

exports.commentPost = async (req, res) => {
  if(!req.body.comment){
    return res.status(200).json({success:false, message: 'Please enter a comment' });
  }
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user.id, text: req.body.comment });
  await post.save();
  return res.json({ success: true, message: 'Comment added' });
};
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate('user') 
      .populate('comments.user', 'username')
      .sort({ createdAt: 'desc' })
      ;  // Populate 'comments.user' field and include only the 'username' field from the user model in each comment

   return  res.status(200).json({ success: true, message:posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getRecommendedPosts=async(req,res)=>{
  try {
    const posts = await Post.find({likes: { $nin: req.user._id }})
    .populate('user') 
      .populate('comments.user', 'username')
      .sort({ createdAt: 'desc' })

    return  res.status(200).json({ success: true, message:posts });
  }
  catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
  