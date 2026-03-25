const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/customer/:customerId', orderController.getOrdersByCustomer);
router.get('/:id', orderController.getOrder);
router.get('/', orderController.getAllOrders); // Admin route, ideally protected

module.exports = router;
