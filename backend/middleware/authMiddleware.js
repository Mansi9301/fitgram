const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const cookie = req.cookies.token;
  if (!cookie) {
    return res.status(200).json({ "success": false, "message": 'Token not found' });
  }
  const decodedToken = jwt.verify(cookie, process.env.SECRET_KEY);
const user=await User.findById(decodedToken._id);

  

  if (!user) {
    return res.status(200).json({ "success": false, "message": 'User not found !' });
  }
  else {
  
    req.user=user;
    next();
}
 
}
module.exports = auth;
