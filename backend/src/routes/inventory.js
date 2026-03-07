const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/:storeId', inventoryController.getInventoryByStore);
router.post('/update', inventoryController.updateStock);
router.post('/transfer', inventoryController.transferStock);

module.exports = router;
