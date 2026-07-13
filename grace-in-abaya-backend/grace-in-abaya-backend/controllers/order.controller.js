const Order   = require('../models/Order');
const Product = require('../models/Product');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/orders  — create order + Stripe Payment Intent
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No order items.' });

    // Validate stock & compute prices
    let itemsPrice = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found.` });
      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `${product.name} is out of stock.` });

      itemsPrice += product.price * item.quantity;
      enrichedItems.push({
        product:  product._id,
        name:     product.name,
        image:    product.images[0] || '',
        price:    product.price,
        quantity: item.quantity,
        size:     item.size,
        color:    item.color,
      });
    }

    const shippingPrice = itemsPrice > 5000 ? 0 : 200;  // free shipping above 5000 PKR
    const totalPrice    = itemsPrice + shippingPrice;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(totalPrice * 100), // in paisa (PKR smallest unit)
      currency: 'pkr',
      metadata: { userId: req.user._id.toString() },
    });

    // Save order
    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentResult: { stripePaymentIntentId: paymentIntent.id },
    });

    // Deduct stock
    for (const item of enrichedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({
      success: true,
      order,
      clientSecret: paymentIntent.client_secret,  // send to frontend for Stripe.js
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/orders/:id/confirm-payment  — called after Stripe confirms on frontend
exports.confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not your order.' });

    order.isPaid  = true;
    order.status  = 'processing';
    order.paymentResult.status = 'paid';
    order.paymentResult.paidAt = new Date();
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/my  — logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders  (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
