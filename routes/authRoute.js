const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/');
const { loginValidators, changePasswordValidators, registerValidators } = require('../validators/authValidator');

router.post('/login', loginValidators, authController.login);
router.post('/register', registerValidators, authController.register);
router.get('/profile', authMiddleware, authController.profile);
router.get('/check-token', authMiddleware, authController.checkToken);
router.put('/change-password', authMiddleware, changePasswordValidators, authController.changePassword);

module.exports = router;
