const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userModel = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    dob: { type: Date, default: Date.now },
    password: { type: String, required: true },
    image: { type: String, required: true },
    gender: { type: String, required: true }

});





module.exports = mongoose.model("users", userModel)