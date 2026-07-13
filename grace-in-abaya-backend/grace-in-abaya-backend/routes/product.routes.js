const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview,
} = require('../controllers/product.controller');

router.get('/',           getProducts);
router.get('/:id',        getProduct);
router.post('/',          protect, adminOnly, createProduct);
router.put('/:id',        protect, adminOnly, updateProduct);
router.delete('/:id',     protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
