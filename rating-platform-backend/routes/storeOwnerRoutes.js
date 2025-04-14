const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Get Store Owner Dashboard Data (protected route)
router.get('/dashboard', verifyToken, checkRole('store_owner'), storeOwnerController.getDashboard);

module.exports = router;
