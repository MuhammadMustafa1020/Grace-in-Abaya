const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const cron     = require('node-cron');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',           require('./routes/auth.routes'));
app.use('/api/products',       require('./routes/product.routes'));
app.use('/api/orders',         require('./routes/order.routes'));
app.use('/api/chatbot',        require('./routes/chatbot.routes'));
app.use('/api/wardrobe',       require('./routes/wardrobe.routes'));
app.use('/api/trends',         require('./routes/trend.routes'));
app.use('/api/fashion-agent',  require('./routes/fashionAgent.routes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Grace in Abaya API running ✅' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // ── Trend Miner Cron ──────────────────────────────────────────────────────
  // Runs every Sunday at 2:00 AM to refresh trend data weekly
  cron.schedule('0 2 * * 0', async () => {
    console.log('⏰ Cron: weekly trend mining starting...');
    const { mineTrends } = require('./services/trendMiner.service');
    await mineTrends();
  });

  console.log('⏰ Trend Miner cron scheduled: every Sunday at 2:00 AM');
});
