const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    course_id: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    grade: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    enrollment_date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;