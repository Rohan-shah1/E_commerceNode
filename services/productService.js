const Product = require('../models/Product');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllProductsFeature = async (queryString) => {
    const features = new APIFeatures(Product.find().populate('category', 'name'), queryString)
        .filter()
        .search()
        .sort()
        .paginate();
    return await features.query;
};

exports.getProductById = async (id) => {
    return await Product.findById(id).populate('category', 'name');
};

exports.createProduct = async (data) => {
    return await Product.create(data);
};

exports.updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};
