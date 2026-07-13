const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
  size:     String,
  color:    String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    address:  String,
    city:     String,
    country:  String,
    phone:    String,
  },
  paymentMethod:   { type: String, default: 'stripe' },
  paymentResult: {
    stripePaymentIntentId: String,
    status:                String,
    paidAt:                Date,
  },
  itemsPrice:    { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  totalPrice:    { type: Number, required: true },
  isPaid:        { type: Boolean, default: false },
  isDelivered:   { type: Boolean, default: false },
  deliveredAt:   Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
