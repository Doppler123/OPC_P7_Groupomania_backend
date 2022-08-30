var passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           

module.exports = schema;