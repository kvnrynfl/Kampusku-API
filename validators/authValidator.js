const { body } = require('express-validator');

exports.loginValidators = [
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.registerValidators = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.changePasswordValidators = [
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];
