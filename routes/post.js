const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const upload = require("../middleware/multer-config")

const postCtrl = require('../controllers/post');

router.get('/', auth, postCtrl.getAllPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, upload.single("post_imageFile"), postCtrl.createPost);  
router.put('/:id', auth, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);

router.patch("/:id/likeInteractions", auth, postCtrl.likeUnlikePost);  
router.post("/:id/likeInteractions", auth, postCtrl.totalOfLikes); 
router.post("/:id/isPostLikedByUser", auth, postCtrl.isPostLikedByUser); 

module.exports = router;