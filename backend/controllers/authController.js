const { validationResult } = require('express-validator');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signupUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Password is hashed by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Explicitly select password (excluded by default via schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last active timestamp
    user.stats.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/profile 
const getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    res.json({ success: true, data: { user: req.user } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name  && name.trim())  user.name  = name.trim();
    if (email && email.trim()) user.email = email.trim();

    const updated = await user.save();
    res.json({ success: true, message: 'Profile updated.', data: { user: updated } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/auth/change-password 
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword; // pre-save hook re-hashes
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { signupUser, loginUser, getProfile, updateProfile, changePassword };
