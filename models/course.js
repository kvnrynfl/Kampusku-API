const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    major_id: {
        type: Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    credits: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    semester: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
