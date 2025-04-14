const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Dashboard Stats Route 
router.get('/stats', verifyToken, checkRole('admin'), adminController.getStats);

// Users Listing with Filters 
router.get('/users', verifyToken, checkRole('admin'), adminController.getUsers);

// Stores Listing with Ratings 
router.get('/stores', verifyToken, checkRole('admin'), adminController.getStores);

// Add User 
router.post('/add-user', verifyToken, checkRole('admin'), adminController.addUser);

// Add Store 
router.post('/add-store', verifyToken, checkRole('admin'), adminController.addStore);

module.exports = router;
