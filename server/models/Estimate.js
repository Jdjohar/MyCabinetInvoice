const mongoose = require('mongoose');
const {Schema} = mongoose;

const EstimateSchema = new Schema({
    estimate_id: { type: Number, unique: true },
    EstimateNumber: { type: String },
    customername: {
        type: String,
    },
    customeremail: {
        type: String,
    },
    purchaseorder: {
        type: String,
    },
    date: {
        type: Date,
    },
    // duedate: {
    //     type: Date,
    // },
    description: {
        type: String,
    },
    items: [],
    subtotal: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    amountdue: {
        type: Number,
        default: 0,
    },
    information: {
        type: String,
    },
    tax: {
        type: String,
    },
    taxpercentage: {
        type: Number,
        default: 0,
    },
    userid:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('Estimate',EstimateSchema)