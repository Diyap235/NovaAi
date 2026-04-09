require('dotenv').config();

const dns = require('dns');
const ATLAS_SRV_DNS = ['8.8.8.8', '1.1.1.1'];

try {
  dns.setServers(ATLAS_SRV_DNS);
  console.warn('⚠️  Using fallback DNS servers globally for Atlas SRV lookups:', ATLAS_SRV_DNS.join(', '));
} catch (dnsError) {
  console.warn('⚠️  Unable to override global DNS servers:', dnsError.message);
}

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const connectDB        = require('./config/db');
const authRoutes       = require('./routes/authRoutes');
const draftRoutes      = require('./routes/draftRoutes');
const toolRoutes       = require('./routes/toolRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

if (!process.env.JWT_SECRET) {
  console.error('❌  FATAL: JWT_SECRET is not set in .env. Exiting.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('❌  FATAL: MONGO_URI is not set in .env. Exiting.');
  process.exit(1);
}

// ─── Connect to MongoDB and start the app only after DB connection succeeds ───
const startServer = async () => {
  await connectDB();

  const app = express();

  // ─── Security headers ─────────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ─────────────────────────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ─── Body parsing ─────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── HTTP request logging (dev only) ─────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // ─── Global rate limiter ──────────────────────────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  });
  app.use(globalLimiter);

  // ─── Stricter limiter for AI tool endpoints ───────────────────────────────────
  const toolLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: { success: false, message: 'Too many AI requests. Please slow down.' },
  });

  // ─── Health check ─────────────────────────────────────────────────────────────
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'NOVA AI Backend Running', version: '1.0.0' });
  });

  // ─── API Routes ───────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/drafts', draftRoutes);
  app.use('/api/tools', toolLimiter, toolRoutes);

  // ─── Error handling ───────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  // ─── Start server ─────────────────────────────────────────────────────────────
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Nova AI server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

startServer();
