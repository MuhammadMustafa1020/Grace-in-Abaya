const mongoose = require('mongoose');

const outfitPlanSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  occasion: { type: String, required: true },
  budget:   { type: Number, required: true },
  season:   String,
  preferences: {
    colors:    [String],
    styles:    [String],
    avoidColors: [String],
  },
  plan: {
    summary:       String,                  // Gemini's overall strategy
    totalEstimate: Number,                  // estimated total cost
    outfits: [{
      label:       String,                  // e.g. "Main Look", "Alternative"
      description: String,
      items: [{
        role:        String,                // 'Abaya', 'Hijab', 'Accessory'
        productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        price:       Number,
        stylingNote: String,
      }],
    }],
    stylingTips:  [String],
    budgetAdvice: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('OutfitPlan', outfitPlanSchema);
