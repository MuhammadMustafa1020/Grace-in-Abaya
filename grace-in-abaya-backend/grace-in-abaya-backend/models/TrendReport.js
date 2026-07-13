const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  categories:  [{ type: String }],   // which product categories this applies to
  tags:        [{ type: String }],   // keywords to match products
  popularity:  { type: Number, min: 1, max: 10 },
  emoji:       { type: String, default: '✦' },
});

const trendReportSchema = new mongoose.Schema({
  season:      { type: String, required: true },  // 'Summer 2025', etc.
  year:        { type: Number, required: true },
  trends:      [trendSchema],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TrendReport', trendReportSchema);
