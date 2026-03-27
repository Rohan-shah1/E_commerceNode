const Order = require('../models/Order');

exports.createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
};

exports.getOrderById = async (id) => {
    return await Order.findById(id).populate('user', 'name email');
};

exports.getUserOrders = async (userId) => {
    return await Order.find({ user: userId });
};

exports.getAllOrders = async () => {
    return await Order.find().populate('user', 'id name');
};

exports.updateOrderToDelivered = async (id) => {
    const order = await Order.findById(id);
    if (!order) return null;
    order.isDelivered = true;
    return await order.save();
};
