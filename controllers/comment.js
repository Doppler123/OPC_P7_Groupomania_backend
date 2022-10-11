const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createComment = (req, res, next) => {
  const { postId, comment_text } =  req.body;
  const decodedBearerToken = jwt.verify(req.cookies.bearerToken, process.env.JWT_SECRET); 
  const sql = `INSERT INTO comments (comment_postId, comment_text, comment_userId) VALUES ("${postId}", "${comment_text}", "${decodedBearerToken.user_id}")`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.getAllComment = (req, res, next) => {
  const sql = `SELECT * FROM comments c, users u WHERE u.user_id=c.comment_userId AND c.comment_postId = ` + req.params.id + ` ORDER BY comment_time ASC`;
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

exports.deleteComment = (req, res, next) => {
  const decodedBearerToken = jwt.verify(req.cookies.bearerToken, process.env.JWT_SECRET);
  let sql = null;
  decodedBearerToken.user_id == 9 ? // the admin's user_id is 9
  sql = `DELETE FROM comments WHERE comment_id = ` + req.params.id
  :
  sql = `DELETE FROM comments WHERE comment_id = ` + req.params.id + ` AND  comment_userId = ` + decodedBearerToken.user_id
  db.query(sql, (err, result) => {
    if (result){
    if (result.affectedRows==1){
    res.status(200).json(result);
    }
    if (result.affectedRows==0){  
    res.status(401).json(result);
    }
    }
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
  });
};

exports.modifyComment = (req, res, next) => {
  const decodedBearerToken = jwt.verify(req.cookies.bearerToken, process.env.JWT_SECRET);
  let sql = null;
  const { comment_text} =  req.body;
  const dataWithQuotationMark = "'" + comment_text + "'"
  decodedBearerToken.user_id == 9 ? // the admin's user_id is 9
  sql = `UPDATE comments SET comment_text = ` + dataWithQuotationMark  + ` WHERE comment_id = ` + req.params.id
  :
  sql = `UPDATE comments SET comment_text = ` + dataWithQuotationMark  + ` WHERE comment_id = ` + req.params.id + ` AND  comment_userId = ` + decodedBearerToken.user_id
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