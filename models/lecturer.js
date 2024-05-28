const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lecturerSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lecturer_id: {
        type: String,
        required: true,
        unique: true
    },
    faculty: {
        type: String,
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
    department: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = Lecturer;
