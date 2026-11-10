import { rateLimit } from 'express-rate-limit';

const options = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next, opts) => {
    res.status(opts.statusCode).type('text').send(opts.message);
  },
};

// Failed logins only; a successful login doesn't count against the limit.
export const loginLimiter = rateLimit({
  ...options,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'too many login attempts, try again in 15 minutes',
});

export const inquiryLimiter = rateLimit({
  ...options,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: 'too many requests, please try again later or contact us on WhatsApp',
});
