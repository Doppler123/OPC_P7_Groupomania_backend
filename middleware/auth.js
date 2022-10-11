const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.cookies.bearerToken) {
      const decodedBearerToken = jwt.verify(req.cookies.bearerToken, process.env.JWT_SECRET); 
      const { user_id: userId } = decodedBearerToken;
      const sql = `SELECT user_id FROM users WHERE user_id = ${userId}`;
      db.query(sql, (err, result) => {
        if (err) res.status(204).json(err);
        else {
          next();
        }
      });
    } else {
      res.clearCookie();
      res.status(401).json({ message: "User is unauthorized"});
    }
  } catch (err) {
    res.clearCookie();
    console.log(err);
    res.status(401).json({ message: "User is unauthorized" });
  }
};

