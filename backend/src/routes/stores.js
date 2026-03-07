const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/', storeController.getAllStores);
router.post('/', storeController.createStore);
router.patch('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;
