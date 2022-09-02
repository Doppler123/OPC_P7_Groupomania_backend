const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

exports.signup = async (req, res, next) => {
    try {
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const user = {
        ...req.body,
        user_password: hashedPassword
    };
    const sql = "INSERT INTO users SET ?";
    db.query(sql, user, (err, result) => {
      if (!result) {
        res.status(200).json({ message: "This email is already existing in database" });
      } else {
        res.status(201).json({ message: "New user successfully created" });
      }
    });
  } catch (err) {
    res.status(200).json({ message: "Problem with authentification", err });
  }
};

 exports.login = (req, res, next) => {
    const { user_email, user_password: nonHashedPassword } = req.body;
    const sql = `SELECT user_id, user_email, user_password, user_isAdmin, user_isActive FROM users WHERE user_email=?`;
    db.query(sql, [user_email], async (err, result) => {
      console.log(result);
        if (err) {
        return res.status(404).json({ err });
      }

      if (result[0] && result[0].user_isActive === 1) {
        try {
          const { user_password: hashedPassword, user_id } = result[0];
          const compareIsOk = await bcrypt.compare(nonHashedPassword, hashedPassword);
          if (compareIsOk) {
            const token = jwt.sign(
                { user_id },
                'Paze454qsd12sc54za45ra', { // this string has to be put in .env
                expiresIn: "24h",
                });
  
            delete result[0].user_password;
  
            res.cookie("jwt", token);
            res.status(200).json({
              user: result[0],
              token: jwt.sign(
                { userId: user_id }, 
                'Paze454qsd12sc54za45ra', {   // this string has to be put in .env
                expiresIn: "24h",
              }),
            });
          } 
        } 
        catch (err) {
          console.log(err);
          return res.status(400).json({ err });
        }
      } else if (result[0] && result[0].user_isActive === 0) {
        res.status(200).json({
          error: true,
          message: "Your account has been desactived",
        });
      } else if (!result[0]) {
        res.status(200).json({
          error: true,
          message: "Email and Pawword are not matching"
        })
      }
    });
  };