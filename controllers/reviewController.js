const reviewService = require('../services/reviewService');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        let reviews;
        if (req.params.productId) {
            reviews = await reviewService.getReviewsByProduct(req.params.productId);
        } else {
            reviews = await reviewService.getAllReviews();
        }
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'No review found with the id' });
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private/Customer
exports.addReview = async (req, res) => {
    try {
        req.body.product = req.params.productId;
        req.body.user = req.user.id;

        const product = await reviewService.checkProductExists(req.params.productId);
        if (!product) return res.status(404).json({ success: false, message: 'No product found' });

        const review = await reviewService.createReview(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await reviewService.getReviewToUpdate(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'No review found' });

        // Make sure review belongs to user or user is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update review' });
        }

        review = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await reviewService.getReviewToUpdate(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'No review found' });

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete review' });
        }

        await reviewService.deleteReview(review);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
