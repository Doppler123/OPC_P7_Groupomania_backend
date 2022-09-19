const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();

exports.createComment = (req, res, next) => {
  const { postId, comment_text, user_id } =  req.body;
  const sql = `INSERT INTO comments (comment_postId, comment_text, comment_userId) VALUES ("${postId}", "${comment_text}", "${user_id}")`;
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
  const sql = `DELETE FROM comments WHERE comment_id = ` + req.params.id;
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

exports.modifyComment = (req, res, next) => {
  const { comment_text} =  req.body;
  const dataWithQuotationMark = "'" + comment_text + "'"
  const sql = `UPDATE comments SET comment_text = ` + dataWithQuotationMark  + ` WHERE comment_id = ` + req.params.id;   
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