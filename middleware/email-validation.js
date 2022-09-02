module.exports = (req, res, next) => {
    const emailVerification = (user_email) => {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let regexTest = regex.test(user_email)
        if (regexTest === true) {
            next()
        }  
        else {
            res.status(401).json({ message: 'Cette adresse mail n\'a pas un format valide' });
        }
    }
    emailVerification(req.body.user_email)
  };