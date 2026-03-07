const express = require('express');
const router = express.Router();
const posController = require('../controllers/posController');

router.post('/sale', posController.createSale);
router.get('/sales/:storeId', posController.getSalesByStore);

module.exports = router;
