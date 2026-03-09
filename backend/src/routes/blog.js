const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/slug/:slug', blogController.getPostBySlug);

// Admin routes (should ideally have auth middleware)
router.post('/', blogController.createPost);
router.post('/generate', blogController.generateContent);
router.get('/:id', blogController.getPostById);
router.put('/:id', blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
