const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);
router.get('/:id/variants', productController.getProductVariants);

module.exports = router;
