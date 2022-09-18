const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();
const jwt = require('jsonwebtoken');

exports.createPost = (req, res, next) => {
  let { body, file } = req;
  body = {
    ...body,
  };
  const decodedBearerToken = jwt.verify(req.cookies.bearerToken, 'Paze454qsd12sc54za45ra'); // this string has to be put in .env
  const sql =`INSERT INTO posts (post_text, post_userId, post_imageName, post_imagePath) VALUES ("${body.post_text}", "${decodedBearerToken.user_id}", "${body.post_imageName}", "${file.path}")`
  db.query(sql, (err, result) => {
    if (result){
      res.status(201).json({ message: 'Message has been posted !'});
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};  

exports.getAllPost = (req, res, next) => {
  const sql =
    "SELECT * FROM posts p, users u WHERE u.user_isActive=1 AND p.post_isActive=1 AND u.user_id=p.post_userId ORDER BY post_time DESC;";
  db.query(sql, (err, result) => {
    if (result){
    res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.getOnePost = (req, res, next) => {
  const sql = `SELECT * FROM posts p, users u WHERE p.post_id = ` + req.params.id + ` AND u.user_id=p.post_userId;`;
  db.query(sql, (err, result) => {
    if (result){
      res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.deletePost = (req, res, next) => {
  const sql = `DELETE FROM posts WHERE post_id = ` + req.params.id;
  db.query(sql, (err, result) => {
    if (result){
      res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.likeUnlikePost = (req, res) => {
  const { userId, postId } = req.body;
  const sql = `SELECT * FROM likes WHERE like_userId = ${userId} AND like_postId = ${postId}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json({ err });
      throw err;
    }
    if (result.length === 0) {
      const sql = `INSERT INTO likes (like_userId	, like_postId) VALUES (${userId}, ${postId})`;
      db.query(sql, (err, result) => {
        res.status(200).json(result);
        if (err) {
          console.log(err);
          res.status(404).json({ err });
          throw err;
        }
      });
    } else {
      const sql = `DELETE FROM likes WHERE like_userId = ${userId} AND like_postId = ${postId}`;
      db.query(sql, (err, result) => {
        res.status(200).json(result);
        if (err) {
          console.log(err);
          res.status(404).json(err);
          throw err;
        }
      });
    }
  });
};

exports.totalOfLikes = (req, res) => {
  const { postId } = req.body;
  const sql = `SELECT COUNT(*) AS total FROM likes WHERE like_postId= ${postId}`;
  db.query(sql, (err, result) => {
    if (result){
      res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.isPostLikedByUser = (req, res) => {
  const { userId, postId } = req.body;
  const sql = `SELECT like_postId, like_userId FROM likes WHERE like_userId = ${userId} AND like_postId	= ${postId}`;
  db.query(sql, (err, result) => {
    if (result){
      res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.modifyPost = (req, res, next) => {
  const sql = `UPDATE posts SET post_text = ` + req.body.post_text + ` WHERE post_id = ` + req.params.id;   // req.body.post_text needs to be sent beetwen ' and '
  db.query(sql, (err, result) => {
    if (result){
      res.status(200).json(result);
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};




