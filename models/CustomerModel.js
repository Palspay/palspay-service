const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new Schema({
    name: { type: String, default: "" },
    JWT_Token: [],
    mobile: {
        type: String,
        default: ""
    },
    countryCode: {
        type: String,
        default: ""
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    password: {
        type: String,
        default: ""
    },
    email: { type: String, default: "" },
    deviceToken: { type: String, default: "" },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Delete'],
        default: "Active"
    },
    lastActive: { type: Date, default: new Date() },
}, {
    timestamps: true
});
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Customer", userSchema, "Customer");