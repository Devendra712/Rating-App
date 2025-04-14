const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const ratingController = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, storeController.getStores);
router.post('/rate', verifyToken, ratingController.submitRating);

module.exports = router;
