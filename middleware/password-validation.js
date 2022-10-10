const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.user_password)) {
        res.status(401).json({ message: 'Veuillez choisir un mot de passe avec au minimum 8 caractères, 1 chiffre, 1 majuscule, 1 minuscule et sans aucun espace' });
    } else {
        next();
    }
};