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
  const { id : postId } = req.params;
  const sql = `SELECT * FROM posts p, users u WHERE p.post_id = ${postId} AND u.user_id=p.post_userId;`;
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
  const { id: post_id } = req.params
  const sql = `DELETE FROM posts WHERE post_id = ${post_id}`;
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



// Bellow there s only code from P6 working with Mongo Db :

/* exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
    ...JSON.parse(req.body.post),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete postObject._userId;
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
 */

