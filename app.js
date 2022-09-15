const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/user');

const postRoutes = require('./routes/post');

const commentRoutes = require('./routes/comment');

app.use(express.json());

app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy : false
}));

app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/comments', commentRoutes);

module.exports = app;
