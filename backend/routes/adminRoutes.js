const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllStores } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require Admin privileges
router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/stores', verifyToken, isAdmin, getAllStores);

module.exports = router;