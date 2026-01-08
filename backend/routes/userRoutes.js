// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, loginUser, signupUser ,updatePassword} = require('../controllers/userController');

const { verifyToken } = require('../middleware/auth')

// Check: Ensure getUsers, loginUser, and signupUser are actually functions here
router.get('/', getUsers); 
router.post('/login', loginUser);
router.post('/signup', signupUser);;

// This route requires authentication
router.put('/update-password', verifyToken, updatePassword);
module.exports = router;