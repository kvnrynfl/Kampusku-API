const { validationResult, matchedData } = require('express-validator');
const { Student, Major, User } = require('../models');

exports.index = async (req, res) => {
    try {
        if (req.user.role === 'mahasiswa') {
            return res.status(200).json({
                status: 'success',
                message: 'Your data retrived successfully',
                data: await Student.findOne({ user_id: req.user._id })
                    .populate('user_id', '-password -__v')
                    .populate('major_id', '-__v')
                    .select('-__v')
            });
        }
        const students = await Student.find()
            .populate('user_id', '-password -__v')
            .populate('major_id', '-__v')
            .select('-__v');

        return res.status(200).json({
            status: 'success',
            message: students.length > 0 ? 'Students retrieved successfully' : 'No students found',
            data: students
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
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

    const data = matchedData(req);
    const user_id = req.user._id;

    try {
        const existingMajor = await Major.findOne({ _id: data.major_id });
        if (!existingMajor) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Major ID'
            });
        }

        const newStudent = new Student({ ...data, user_id });
        await newStudent.save();

        const user = await User.findOne({ _id: user_id });
        user.role = 'mahasiswa';
        user.save();

        const student = await Student.findOne({ _id: newStudent._id })
            .populate('user_id', '-password -__v')
            .populate('major_id', '-__v')
            .select('-__v');

        return res.status(201).json({
            status: 'success',
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.read = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('user_id', '-password -__v')
            .populate('major_id', '-__v')
            .select('-__v');

        if (!student) {
            return res.status(404).json({
                status: 'error',
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Student retrieved successfully',
            data: student
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
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

    const data = matchedData(req);

    try {
        const existingMajor = await Major.findOne({ _id: data.major_id });
        if (!existingMajor) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Major ID'
            });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                status: 'error',
                message: 'Student not found'
            });
        }

        if (req.user.role === 'mahasiswa' && student.status === 'verified') {
            return res.status().json({
                status: 'error',
                message: "tidak bisa mengupdate daata yang sudah di verifikasi"
            })
        }

        Object.assign(student, data);

        await student.save();

        return res.status(200).json({
            status: 'success',
            message: 'Student updated successfully',
            data: await Student.findById({ _id: student._id }).select('-_id -__v')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                status: 'error',
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};
