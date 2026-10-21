import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after a few minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // 60 AI calls per 10 mins
  message: {
    success: false,
    error: 'AI rate limit reached. Please wait a moment before requesting more AI suggestions.'
  }
});
