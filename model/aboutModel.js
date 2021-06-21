const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const aboutModel = new Schema({
    qualification: { type: String, required: true },
    skills: { type: Array, default: [] },
    address: { type: String, required: true },
    dob: { type: Date, default: Date.now },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'users' }
});





module.exports = mongoose.model("about", aboutModel)