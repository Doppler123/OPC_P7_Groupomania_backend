const dbConfig = require("../db-config");
const db = dbConfig.dbConnection();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

exports.signup = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const user = {
      ...req.body,
      user_password: hashedPassword
      };
      const userEmailWithDotationMarks = '"'+user.user_email+'"'
      const sqlExists = "SELECT EXISTS (SELECT * FROM users WHERE user_email=" + userEmailWithDotationMarks + ")";
      db.query(sqlExists, user, (err, result) => {
      parsedResultAsAnObject = (JSON.parse(JSON.stringify(result[0])))
      if (Object.values(parsedResultAsAnObject)==1) {
        res.status(200).json({ message: "This email is already existing in database" });
      }
      if (Object.values(parsedResultAsAnObject)==0){
      const sql = "INSERT INTO users SET ?";
      db.query(sql, user, (err, result) => {
        if (result) {
          res.status(201).json({ message: "New user successfully created" });
        }
        if (err) {
          console.log(err);
          res.status(404).json({ err });
          throw err;
        }})
      }
      else if (err) {
        console.log(err);
        res.status(404).json({ err });
        throw err;
      }
    }
    )
  }

 exports.login = (req, res, next) => {
    const { user_email, user_password: nonHashedPassword } = req.body;
    const sql = `SELECT user_id, user_email, user_firstName, user_lastName, user_password, user_isAdmin FROM users WHERE user_email=?`;
    db.query(sql, [user_email], async (err, result) => {
        if (err) {
        return res.status(404).json({ err });
      }

      if (result[0]) {
        try {
          const { user_password: hashedPassword, user_id } = result[0];
          const compareIsOk = await bcrypt.compare(nonHashedPassword, hashedPassword);
          if (compareIsOk) {
            const token = jwt.sign(
                { user_id },
                process.env.JWT_SECRET, { 
                expiresIn: "24h",
                });
  
            delete result[0].user_password;
            res.cookie("bearerToken", token);  // this ligne create a session cookie
            // to create a cookie with a max expiration date, we can use :
/*             res.cookie("bearerToken", token, {
              expires: new Date(Date.now() + 15000000000000)
            }); */
            res.status(200).json({
              user: result[0],
              token: jwt.sign(
                { userId: user_id }, 
                process.env.JWT_SECRET, {  
                expiresIn: "24h",
              }),
            });
          } 
        } 
        catch (err) {
          console.log(err);
          return res.status(400).json({ err });
        }
      } else if (!result[0]) {
        res.status(200).json({
          error: true,
          message: "Identifiant et/ou mot de passe incorrect"
        })
      }
    });
  };