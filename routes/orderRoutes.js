const express = require('express');
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;
