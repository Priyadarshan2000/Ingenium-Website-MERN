const mongoose = require('mongoose');
const User = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    created: {
        type: Date,
        default: Date.now(),
    }
});
module.exports = mongoose.model("User", User);