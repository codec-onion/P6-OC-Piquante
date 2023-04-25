const mongoose = require('mongoose')
const uniqueEmail = require("mongoose-unique-validator")

const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userShema.plugin(uniqueEmail)

module.exports = mongoose.model("User", userShema)