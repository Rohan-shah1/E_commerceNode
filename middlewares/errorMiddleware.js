const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error(`[Error Thrown] ${err.message}`);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with formatting of id ${err.value}`;
        error = new Error(message);
        error.statusCode = 404;
    }

    // Mongoose duplicate key index collision
    if (err.code === 11000) {
        const message = 'Duplicate field value entered into database';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose raw validation failure
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message);
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error Encountered'
    });
};

module.exports = errorHandler;
