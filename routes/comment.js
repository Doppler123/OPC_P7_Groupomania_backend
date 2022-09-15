const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const commentCtrl = require('../controllers/comment');

router.get('/:id', auth, commentCtrl.getAllComment); 
router.post('/:id', auth, commentCtrl.createComment);   
router.delete('/:id', auth, commentCtrl.deleteComment); // ajouter "auth"

module.exports = router;