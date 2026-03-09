const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Public route for now, can add session/user middleware if needed
router.post('/', chatbotController.handleMessage);

module.exports = router;
