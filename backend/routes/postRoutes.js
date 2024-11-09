const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer to store files in 'uploads' directory
const { createPost, getFeedPosts, deletePost, getPostById, createComment, likePost, getPostsByUserId, editPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Apply 'upload.single('image')' middleware to handle file upload
router.post("/create", protect, createPost);
router.get("/", protect, getFeedPosts);
router.delete("/delete/:id", protect, deletePost);
router.delete("/edit/:id", protect, deletePost);
router.get("/:id", protect, getPostById);
router.post("/:id/comments", protect, createComment);
router.put("/:id/like", protect, likePost);
router.get('/user/:id', protect,getPostsByUserId);
router.put("/:id", protect, editPost);
                
module.exports = router;
