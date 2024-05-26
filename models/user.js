const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hashPassword, comparePassword } = require('../utils/bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'mahasiswa', 'dosen', 'unknown'],
        default: 'unknown'
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await hashPassword(this.password);
    }
    next();
});

userSchema.method('comparePassword', async function (candidatePassword) {
    return comparePassword(candidatePassword, this.password);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
