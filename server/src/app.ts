import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();

// =====================================================================
// Security Middleware
// =====================================================================
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: [env.clientUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'AI rate limit exceeded. Please wait a minute.' },
});

app.use(limiter);

// =====================================================================
// Body Parsing
// =====================================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================================
// Logging
// =====================================================================
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// =====================================================================
// Health Check
// =====================================================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini Eraser API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// =====================================================================
// API Routes
// =====================================================================
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

// =====================================================================
// Error Handling
// =====================================================================
app.use(notFound);
app.use(errorHandler);

export default app;
