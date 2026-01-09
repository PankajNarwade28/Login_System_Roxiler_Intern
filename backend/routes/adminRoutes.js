const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllStores ,addStore, addUser} = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require Admin privileges
router.get('/stats', verifyToken, isAdmin, getStats);
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/stores', verifyToken, isAdmin, getAllStores);  

// Ensure these paths match exactly what the frontend is calling
router.post('/add-user', addUser);
router.post('/add-store', addStore);
 
module.exports = router;