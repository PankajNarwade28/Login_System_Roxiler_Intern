// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, loginUser, signupUser ,updatePassword,getStores, submitRating} = require('../controllers/userController');

const { verifyToken } = require('../middleware/auth')

// Check: Ensure getUsers, loginUser, and signupUser are actually functions here
router.get('/', getUsers); 
router.post('/login', loginUser);
router.post('/signup', signupUser);;

// This route requires authentication
router.put('/update-password', verifyToken, updatePassword);

// Requirement: Normal users can view a list of all registered stores
router.get('/', verifyToken, getStores);

module.exports = router;