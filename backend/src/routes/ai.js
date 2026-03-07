const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// All AI routes should probably be protected (Admin only)
// For now adding the route, middleware can be added later if auth is integrated here
router.post('/generate-product', aiController.generateProduct);

module.exports = router;
