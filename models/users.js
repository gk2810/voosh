const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    isAdmin: {
        required: true,
        type: Boolean
    },
    photo: {
        type: String
    },
    isPublic: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model("users", userSchema);