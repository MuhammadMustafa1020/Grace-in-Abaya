const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWardrobe, addItem, removeItem, getSuggestions,
} = require('../controllers/wardrobe.controller');

router.get('/',        protect, getWardrobe);
router.post('/',       protect, addItem);
router.delete('/:id',  protect, removeItem);
router.post('/suggest', protect, getSuggestions);

module.exports = router;
