const express = require('express');
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/api/posts', postController.getAllPosts);
router.get('/api/posts/:id', postController.getPostById);

// Protected (must pass function references, not function results)
router.post('/api/posts', protect, postController.createPost);
router.patch('/api/posts/:id', protect, postController.updatePost);
router.delete('/api/posts/:id', protect, postController.deletePost);

module.exports = router;