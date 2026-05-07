const express = require('express');
const router = express.Router();
const {
    getMeasurementsByCustomer,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addMeasurement);
router.route('/:customerId').get(protect, getMeasurementsByCustomer);
router
    .route('/item/:id') // Changed path to avoid conflict with customerId route
    .put(protect, updateMeasurement)
    .delete(protect, deleteMeasurement);

module.exports = router;
