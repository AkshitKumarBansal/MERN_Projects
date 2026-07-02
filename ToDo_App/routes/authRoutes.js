const express = require('express');
const AuthController = require('../controllers/authContoller');
const User = require('../models/User');
const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

module.exports = router;