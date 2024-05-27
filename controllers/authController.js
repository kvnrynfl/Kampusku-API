const { body, validationResult, } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.login = [
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            if (!await user.comparePassword(password)) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            const token = await generateToken(user);

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: token,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
];

exports.register = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                data: errors.array()
            });
        }

        const { name, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already exists',
                });
            }

            const newUser = new User({ name, email, password });

            await newUser.save();

            return res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: await User.findById(newUser._id)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
];


exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User profile retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.changePassword = [
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { current_password, new_password } = req.body;

        try {
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            if (!await user.comparePassword(current_password)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            user.password = new_password;

            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
];