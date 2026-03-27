const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getReviewsByProduct = async (productId) => {
    return await Review.find({ product: productId });
};

exports.getAllReviews = async () => {
    return await Review.find().populate({ path: 'product', select: 'name description' });
};

exports.getReviewById = async (id) => {
    return await Review.findById(id).populate({ path: 'product', select: 'name description' });
};

exports.checkProductExists = async (productId) => {
    return await Product.findById(productId);
};

exports.createReview = async (reviewData) => {
    return await Review.create(reviewData);
};

exports.getReviewToUpdate = async (id) => {
    return await Review.findById(id);
};

exports.updateReview = async (id, data) => {
    return await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteReview = async (reviewObj) => {
    return await reviewObj.deleteOne();
};
