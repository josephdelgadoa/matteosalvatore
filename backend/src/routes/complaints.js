const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router.post('/', complaintsController.createComplaint);
router.get('/', complaintsController.getAllComplaints); // Usually protected by auth in a real world, assuming API is called by service or protected dashboard

module.exports = router;
