const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.get('/:id/variants', productController.getProductVariants);

// Admin Routes (Protect these in real app)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
