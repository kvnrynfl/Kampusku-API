const { validationResult, matchedData } = require('express-validator');
const { Major } = require('../models');

exports.index = async (req, res) => {
    try {
        const majors = await Major.find().select('-__v');

        return res.status(200).json({
            status: 'success',
            message: majors.length > 0 ? 'Major list retrieved successfully' : 'No majors found',
            data: majors
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.create = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            data: errors.array()
        });
    }

    const { name, description } = matchedData(req);

    try {
        const existingMajor = await Major.findOne({ name });

        if (existingMajor) {
            return res.status(400).json({
                status: 'error',
                message: 'Major already exists'
            });
        }

        const newMajor = new Major({ name, description });

        await newMajor.save();

        return res.status(201).json({
            status: 'success',
            message: 'Major created successfully',
            data: await Major.findById(newMajor._id).select('-__v')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.read = async (req, res) => {
    try {
        const major = await Major.findById(req.params.id).select('-__v');

        if (!major) {
            return res.status(404).json({
                status: 'error',
                message: 'Major not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Major retrieved successfully',
            data: major
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.update = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            data: errors.array()
        });
    }

    const { name, description } = matchedData(req);

    try {
        let major = await Major.findById(req.params.id);

        if (!major) {
            return res.status(404).json({
                status: 'error',
                message: 'Major not found'
            });
        }

        if (name) {
            major.name = name;
        }
        if (description) {
            major.description = description;
        }

        await major.save();

        return res.status(200).json({
            status: 'success',
            message: 'Major updated successfully',
            data: await Major.findById(major._id).select('-__v')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const major = await Major.findByIdAndDelete(req.params.id);

        if (!major) {
            return res.status(404).json({
                status: 'error',
                message: 'Major not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Major deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
