const User = require('../models/User');

exports.findUserByEmail = async (email, includePassword = false) => {
    if (includePassword) {
        return await User.findOne({ email }).select('+password');
    }
    return await User.findOne({ email });
};

exports.findUserById = async (id) => {
    return await User.findById(id);
};

exports.createUser = async (userData) => {
    return await User.create(userData);
};
