const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth'); // If we want to protect it

const router = express.Router();

router.post('/process', paymentController.processPayment);

module.exports = router;
