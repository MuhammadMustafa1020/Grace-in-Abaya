const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getLatest, mine }    = require('../controllers/trend.controller');

router.get('/',     getLatest);
router.post('/mine', protect, adminOnly, mine);

module.exports = router;
