require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
const auth = require('./middleware/authMiddleware');
const cp = require('cookie-parser');
const bp = require('body-parser');

const app = express();

app.use(cp());
app.use(bp.urlencoded({ extended: false }));
app.use(cors({origin:"http://localhost:3000",credentials:true,
}));


connectDB();
app.use(express.json());


app.use('/uploads', express.static('uploads'));

app.get("/auth/isLoggedin", auth, (req, res) => {
    return res.json({ "success": true, "message": req.user });
  });

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.listen(8000, () => console.log('Server running on port 8000'));
