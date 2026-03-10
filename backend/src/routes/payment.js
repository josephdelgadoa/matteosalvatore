const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth'); // If we want to protect it

const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.post('/process', paymentController.processPayment);
router.post('/webhook', webhookController.handleCulqiWebhook);

module.exports = router;
