const fs = require('fs');
const path = require('path');

// @desc    Logs request to console and asynchronously to an access log
const logger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl } = req;
    
    // Trigger on response completion
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLine = `${new Date().toISOString()} - ${method} ${originalUrl} - Status: ${res.statusCode} - ${duration}ms\n`;
        
        console.log(logLine.trim());
        
        // Append to local physical log file securely
        fs.appendFile(path.join(__dirname, '../access.log'), logLine, (err) => {
            if (err) console.error('Logging to file failed:', err);
        });
    });

    next();
};

module.exports = logger;
