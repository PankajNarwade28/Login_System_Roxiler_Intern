// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, loginUser, signupUser } = require('../controllers/userController');

// Check: Ensure getUsers, loginUser, and signupUser are actually functions here
router.get('/', getUsers); 
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;