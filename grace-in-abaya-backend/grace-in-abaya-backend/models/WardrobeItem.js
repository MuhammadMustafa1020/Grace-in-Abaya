const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // null if added manually
  name:       { type: String, required: true },
  category:   { type: String, required: true },
  color:      String,
  size:       String,
  image:      String,
  tags:       [String],   // e.g. ['eid', 'casual', 'winter']
  notes:      String,
  addedFrom:  { type: String, enum: ['purchase', 'manual'], default: 'manual' },
}, { timestamps: true });

module.exports = mongoose.model('WardrobeItem', wardrobeItemSchema);
