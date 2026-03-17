const express  = require('express');
const { body } = require('express-validator');
const {
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Validation rules ─────────────────────────────────────────────────────────
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Public routes ────────────────────────────────────────────────────────────
router.post('/signup', signupValidation, signupUser);
router.post('/login',  loginValidation,  loginUser);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
