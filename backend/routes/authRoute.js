const express = require('express');
const { register, login, getMe, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for getting the authenticated user's details
router.get('/me', protect, getMe);

router.put('/update', protect, updateUser);

module.exports = router;
