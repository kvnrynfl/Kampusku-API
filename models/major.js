const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const majorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
