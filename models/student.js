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
        default: new Date().getFullYear(),
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

studentSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastStudent = await mongoose.model('Student').findOne().sort({ createdAt: -1 });
        const lastNim = lastStudent ? parseInt(lastStudent.nim, 10) : 0;
        this.nim = (lastNim + 1).toString().padStart(8, '0');
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
