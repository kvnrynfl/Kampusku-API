const { body } = require('express-validator');

exports.createStudentValidators = [
    body('major_id').isMongoId().withMessage('Invalid Major ID'),
    body('year_of_entry').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year of entry'),
    body('phone').isMobilePhone().withMessage('Invalid phone number'),
    body('address').notEmpty().withMessage('Address is required'),
    body('date_of_birth').isDate().withMessage('Invalid date of birth'),
];

exports.updateStudentValidators = [
    body('major_id').optional().isMongoId().withMessage('Invalid Major ID'),
    body('year_of_entry').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year of entry'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('address').optional().notEmpty().withMessage('Address is required'),
    body('date_of_birth').optional().isDate().withMessage('Invalid date of birth'),
    body('status').optional().custom((value, { req }) => {
        if (req.user.role !== 'admin') {
            throw new Error('Only admin users can update student status');
        }
        return true;
    }).isIn(['registered', 'verified', 'graduated', 'dropout']).withMessage('Invalid status'),
    body('dropout_date').optional().custom((value, { req }) => {
        if (req.user.role !== 'admin') {
            throw new Error('Only admin users can update student dropout date');
        }
        return true;
    }).isDate().withMessage('Invalid dropout date'),
];
