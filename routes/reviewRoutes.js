const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviewController');

const Review = require('../models/Review');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getReviews)
    .post(protect, authorize('customer'), addReview);

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('customer', 'admin'), updateReview)
    .delete(protect, authorize('customer', 'admin'), deleteReview);

module.exports = router;
