import dns from 'dns';
// Set public DNS resolvers to handle SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { connectDB, isDbConnected } from './config/db';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/error.middleware';

// Domain Route Imports
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import tailorRoutes from './routes/tailor.routes';
import jobRoutes from './routes/job.routes';
import interviewRoutes from './routes/interview.routes';
import newsRoutes from './routes/news.routes';

const app = express();

// Security & Global Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(globalLimiter);

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Skill2Hire Backend API is operating normally.',
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'MongoDB Atlas Cloud' : 'Local High-Resilience Storage'
  });
});

// Mount 5 Independent Module Routes + Auth
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/tailor-resume', tailorRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/news', newsRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  
  app.listen(ENV.PORT, () => {
    console.log(`============================================================`);
    console.log(`🚀 Skill2Hire Backend Server running on port ${ENV.PORT}`);
    console.log(`📡 Client Origin allowed: ${ENV.CLIENT_URL}`);
    console.log(`🍃 Database mode: ${isDbConnected ? 'MongoDB Atlas Cloud' : 'Local Resilient Storage'}`);
    console.log(`============================================================`);
  });
};

startServer();

export default app;
