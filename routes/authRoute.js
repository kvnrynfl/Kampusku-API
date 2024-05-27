const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/')

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authMiddleware, authController.profile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;