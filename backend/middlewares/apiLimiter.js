const slowDown = require("express-slow-down");

const apiLimiter = slowDown({
  windowMs: (process.env.SLOW_DOWN_WINDOW_MINUTES || 15) * 60 * 1000, // 15 minutes
  delayAfter: process.env.SLOW_DOWN_WINDOW_MAX_REQUESTS || 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  delayMs: process.env.SLOW_DOWN_DELAY_MS || 500,
});

module.exports = {
  apiLimiter,
};
