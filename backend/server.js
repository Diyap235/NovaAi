require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('  Unable to override DNS servers:', e.message);
}

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB     = require('./config/db');
const authRoutes    = require('./routes/authRoutes');
const draftRoutes   = require('./routes/draftRoutes');
const toolRoutes    = require('./routes/toolRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ─── Validate critical env vars ───────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('❌  FATAL: JWT_SECRET is not set in .env. Exiting.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('  FATAL: MONGO_URI is not set in .env. Exiting.');
  process.exit(1);
}

// ─── Rate limiters ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 2000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  skip: (req) => req.path === '/',
});

const toolLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 200 : 20,
  message: { success: false, message: 'Too many AI requests. Please slow down.' },
});

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(globalLimiter);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'NOVA AI Backend Running', version: '1.0.0' });
  });

  // Routes
  app.use('/api/auth',   authRoutes);
  app.use('/api/drafts', draftRoutes);
  app.use('/api/tools',  toolLimiter, toolRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`  Nova AI server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

startServer();
