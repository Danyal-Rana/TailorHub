const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrdersByCustomer,
    createOrder,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/customer/:customerId').get(protect, getOrdersByCustomer);
router
    .route('/:id')
    .put(protect, updateOrder)
    .delete(protect, deleteOrder);

module.exports = router;
