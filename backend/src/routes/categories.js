const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Helper to wrap async routes
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Routes
router.get('/', asyncHandler(categoryController.getAll));
router.get('/:id', asyncHandler(categoryController.getById));
router.post('/', asyncHandler(categoryController.create));
router.put('/:id', asyncHandler(categoryController.update));
router.delete('/:id', asyncHandler(categoryController.delete));
router.post('/reorder', asyncHandler(categoryController.reorder));

module.exports = router;
