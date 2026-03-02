const rateLimit = require('express-rate-limit');

const messageLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    requestWasSuccessful: (req,res) => res.statusCode < 400,
    skipFailedRequests: true,
    message:{success:false,message:"You can create a maximum of 500 messages in 1 day."},
});

module.exports = {messageLimiter};
