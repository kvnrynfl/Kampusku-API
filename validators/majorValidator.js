const { body } = require('express-validator');

exports.createMajorValidators = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string')
];

exports.updateMajorValidators = [
    body('name').optional().trim().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().withMessage('Description must be a string')
];
