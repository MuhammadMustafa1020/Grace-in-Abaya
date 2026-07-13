const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createOrder, confirmPayment, getMyOrders,
  getAllOrders, updateOrderStatus,
} = require('../controllers/order.controller');

router.post('/',                    protect, createOrder);
router.post('/:id/confirm-payment', protect, confirmPayment);
router.get('/my',                   protect, getMyOrders);
router.get('/',                     protect, adminOnly, getAllOrders);
router.put('/:id/status',           protect, adminOnly, updateOrderStatus);

module.exports = router;
