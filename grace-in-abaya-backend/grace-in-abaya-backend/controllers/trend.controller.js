const { mineTrends, getLatestTrends } = require('../services/trendMiner.service');

// GET /api/trends  — latest trend report (public)
exports.getLatest = async (req, res) => {
  try {
    const report = await getLatestTrends();
    if (!report) return res.json({ success: true, report: null, message: 'No trends mined yet.' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/trends/mine  — trigger mining (admin only)
exports.mine = async (req, res) => {
  try {
    const result = await mineTrends();
    if (!result.success) return res.status(500).json({ success: false, message: result.error });
    const report = await getLatestTrends();
    res.json({ success: true, message: `Mined ${result.count} trends.`, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
