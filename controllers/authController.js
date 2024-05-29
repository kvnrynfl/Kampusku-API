const moment = require('moment');
const { validationResult, matchedData } = require('express-validator');
const { User } = require('../models');
const { generateToken, verifyToken } = require('../utils/jwt');

exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            data: errors.array()
        });
    }

    const { email, password } = matchedData(req);

    try {
        const user = await User.findOne({ email });

        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = await generateToken(user);

        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            data: errors.array()
        });
    }

    const { name, email, password } = matchedData(req);

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
            data: await User.findById(newUser._id).select('-password -__v')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');

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
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.checkToken = async (req, res) => {
    try {
        const decoded = await verifyToken(req.token);

        const createdAt = moment.unix(decoded.iat);
        const expiresAt = moment.unix(decoded.exp);
        const durationUntilExpiration = moment.duration(expiresAt.diff(moment()));

        return res.status(200).json({
            status: 'success',
            message: 'Token details retrieved successfully',
            data: {
                createdAt: createdAt.format(),
                expiresAt: expiresAt.format(),
                durationUntilExpiration: {
                    days: durationUntilExpiration.days(),
                    hours: durationUntilExpiration.hours(),
                    minutes: durationUntilExpiration.minutes(),
                    seconds: durationUntilExpiration.seconds()
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.changePassword = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            data: errors.array()
        });
    }

    const { current_password, new_password } = matchedData(req);

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

        return res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};
