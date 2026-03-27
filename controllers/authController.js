const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate tokens
const generateTokens = (id, role) => {
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
    return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        // Create user
        const user = await User.create({ name, email, password, role });
        
        // Respond with tokens
        const tokens = generateTokens(user._id, user.role);
        res.status(201).json({ 
            success: true, 
            tokens, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validate request
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }
        
        // Find user & include password field explicitly
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Check if matching password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Generate tokens upon success
        const tokens = generateTokens(user._id, user.role);
        res.status(200).json({ 
            success: true, 
            tokens, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'No refresh token provided' });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Ensure user actually still exists in database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const tokens = generateTokens(user._id, user.role);
        res.status(200).json({ success: true, tokens });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};
