const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middlewares
const logger = require('./middlewares/loggerMiddleware');
const advancedTracker = require('./middlewares/advancedTracker');
const errorHandler = require('./middlewares/errorMiddleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

app.use(express.json());

// Security Middlewares
app.use(helmet());
app.use(cors());

// Custom Data Sanitization for NoSQL & XSS
// Packages like `express-mongo-sanitize` attempt to reassign the entire `req.query` object, which predictably crashes Express 5
const sanitizeData = (obj) => {
    if (!obj) return;
    for (let key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
            continue;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeData(obj[key]);
        } else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
    }
};

app.use((req, res, next) => {
    sanitizeData(req.body);
    sanitizeData(req.query);
    sanitizeData(req.params);
    next();
});

app.use(logger);
app.use(advancedTracker);

// Rate Limiting Config
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 150, // limit API to 150 requests per windowMs
    message: 'Too many API requests, please try again later'
});
app.use('/api', limiter);

// Swagger API Documentation Setup
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Load routers
const path = require('path');
const auth = require('./routes/authRoutes');
const categories = require('./routes/categoryRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');
const reviews = require('./routes/reviewRoutes');
const uploads = require('./routes/uploadRoutes');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/categories', categories);
app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/uploads', uploads);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'E-commerce API is running...' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Configure Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
