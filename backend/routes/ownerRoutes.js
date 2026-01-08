const express = require('express');
const router = express.Router();
const { getMyStoreData } = require('../controllers/ownerController');
const { verifyToken } = require('../middleware/auth');

router.get('/my-store', verifyToken, getMyStoreData);

module.exports = router;