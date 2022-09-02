var mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    port : 6000,
    user     : 'root',
    password : '',
    database : 'groupomania_db'
  });

db.connect(function(err) {   if (err) throw err;   console.log("Connecté à la base de données MySQL!"); });

module.exports.dbConnection = () => {
    return db
}