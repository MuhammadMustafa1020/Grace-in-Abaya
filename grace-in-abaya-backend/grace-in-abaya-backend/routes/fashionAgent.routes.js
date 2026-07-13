const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { createPlan, getMyPlans, deletePlan } = require('../controllers/fashionAgent.controller');

router.post('/plan',        protect, createPlan);
router.get('/plans',        protect, getMyPlans);
router.delete('/plans/:id', protect, deletePlan);

module.exports = router;
