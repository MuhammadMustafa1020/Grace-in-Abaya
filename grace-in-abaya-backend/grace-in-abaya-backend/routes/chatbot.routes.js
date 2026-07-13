const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { chat }    = require('../controllers/chatbot.controller');

// Requires login so chatbot is personalized per user
router.post('/chat', protect, chat);

module.exports = router;
