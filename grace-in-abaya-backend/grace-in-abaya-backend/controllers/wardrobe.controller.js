const WardrobeItem = require('../models/WardrobeItem');
const { getChatbotReply } = require('../services/chatbot.service');

// GET /api/wardrobe  — get user's wardrobe
exports.getWardrobe = async (req, res) => {
  try {
    const items = await WardrobeItem.find({ user: req.user._id }).populate('product', 'name images price');
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/wardrobe  — add item
exports.addItem = async (req, res) => {
  try {
    const item = await WardrobeItem.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/wardrobe/:id
exports.removeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, message: 'Removed from wardrobe.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/wardrobe/suggest  — AI styling suggestions based on wardrobe
exports.getSuggestions = async (req, res) => {
  try {
    const { occasion, season } = req.body;
    const items = await WardrobeItem.find({ user: req.user._id });

    if (items.length === 0)
      return res.json({ success: true, suggestion: 'Your wardrobe is empty. Add some items and I can suggest outfits for you!' });

    const wardrobeSummary = items
      .map(i => `- ${i.name} (${i.category}, color: ${i.color || 'unspecified'}, tags: ${i.tags.join(', ')})`)
      .join('\n');

    const prompt = `Here is the user's current wardrobe:\n${wardrobeSummary}\n\nPlease suggest a complete outfit for: ${occasion || 'a casual day'} in ${season || 'current'} season. Include what to pair together and any styling tips.`;

    const reply = await getChatbotReply([{ role: 'user', content: prompt }]);
    res.json({ success: true, suggestion: reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
