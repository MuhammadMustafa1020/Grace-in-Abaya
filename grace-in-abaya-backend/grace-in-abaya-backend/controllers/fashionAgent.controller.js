const { runFashionAgent, getUserPlans } = require('../services/fashionAgent.service');

// POST /api/fashion-agent/plan  — create a new outfit plan
exports.createPlan = async (req, res) => {
  try {
    const { occasion, budget, season, preferences } = req.body;

    if (!occasion || !budget)
      return res.status(400).json({ success: false, message: 'Occasion and budget are required.' });
    if (budget < 500)
      return res.status(400).json({ success: false, message: 'Budget must be at least PKR 500.' });

    const plan = await runFashionAgent({
      userId: req.user._id,
      occasion,
      budget: Number(budget),
      season,
      preferences: preferences || {},
    });

    res.status(201).json({ success: true, plan });
  } catch (err) {
    console.error('Fashion agent error:', err);
    res.status(500).json({ success: false, message: 'Agent failed. Please try again.' });
  }
};

// GET /api/fashion-agent/plans  — user's saved plans
exports.getMyPlans = async (req, res) => {
  try {
    const plans = await getUserPlans(req.user._id);
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/fashion-agent/plans/:id
exports.deletePlan = async (req, res) => {
  try {
    const OutfitPlan = require('../models/OutfitPlan');
    await OutfitPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Plan deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
