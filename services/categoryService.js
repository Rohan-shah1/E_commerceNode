const Category = require('../models/Category');

exports.getAllCategories = async () => {
    return await Category.find();
};

exports.getCategoryById = async (id) => {
    return await Category.findById(id);
};

exports.createCategory = async (data) => {
    return await Category.create(data);
};

exports.updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

exports.deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};
