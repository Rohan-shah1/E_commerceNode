const { v4: uuidv4 } = require('uuid');

// @desc Innovative tracking injected directly into Express pipeline
const advancedTracker = (req, res, next) => {
    // 1. Assign unique trace ID for complex observability graphs
    req.id = uuidv4();
    res.setHeader('X-Trace-Id', req.id);

    // 2. Hide and obfuscate framework identity (security by obscurity subset)
    res.setHeader('X-Powered-By', 'MVT-ECommerce-Systems');
    
    // 3. Document payload lengths precisely
    if(req.body) {
         req.payloadAudit = JSON.stringify(req.body).length;
    }

    next();
};

module.exports = advancedTracker;
