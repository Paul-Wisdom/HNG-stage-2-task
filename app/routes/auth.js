const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/auth/register', authController.postSignUp);
router.post('/auth/login', authController.postSignIn);

module.exports = router;