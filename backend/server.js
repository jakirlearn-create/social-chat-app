require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const conversationRoutes = require('./routes/conversations');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');
// const uploadsRoutes = require('./routes/uploads');
// const profileRoutes = require('./routes/profile');

const app = express();

// Middleware
app.use(helmet());

// CORS Configuration - Simplified for Vercel
app.use(cors({
  origin: '*', // Allow all origins for Vercel serverless
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

// Additional CORS headers for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('? MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/uploads', uploadsRoutes);
// app.use('/api/profile', profileRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`? Server running on port ${PORT}`);
    console.log(`? Environment: ${process.env.NODE_ENV}`);
    console.log(`? Frontend URL: ${process.env.FRONTEND_URL}`);
  });
}

// Export for Vercel serverless
module.exports = app;

