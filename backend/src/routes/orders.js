const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('/customer/:customerId', orderController.getOrdersByCustomer);
router.get('/', orderController.getAllOrders); // Admin route, ideally protected

module.exports = router;
