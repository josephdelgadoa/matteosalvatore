const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/remove/:id', cartController.removeFromCart);
router.put('/update/:id', cartController.updateCartItem);
router.post('/clear', cartController.clearCart);

module.exports = router;
