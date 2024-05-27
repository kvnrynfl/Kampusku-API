const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    nim: {
        type: String,
        unique: true,
        default: null
    },
    major_id: {
        type: Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    },
    year_of_entry: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'verified', 'graduated', 'dropout'],
        default: 'registered'
    },
    dropout_date: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;