const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getStaff, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const User = require('../models/User');

const router = express.Router();

// Get all staff (for admin to assign complaints)
router.get('/staff', auth, roleCheck('admin'), getStaff);

// Get all users (admin only)
router.get('/', auth, roleCheck('admin'), getUsers);

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.patch('/:id', auth, roleCheck('admin'), updateUser);

// Delete user
router.delete('/:id', auth, roleCheck('admin'), deleteUser);

module.exports = router;