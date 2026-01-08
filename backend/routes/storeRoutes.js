const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getStores);
router.post('/rate', verifyToken, submitRating);

module.exports = router;