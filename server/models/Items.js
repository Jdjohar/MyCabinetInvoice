const mongoose = require('mongoose');
const {Schema} = mongoose;

const ItemsSchema = new Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true 
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory', 
        required: true 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    Subcategory: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        // required: true
    },
    spiceLevel: { 
        type: String,
        enum: [' ', 'Mild', 'Medium', 'Hot'],
        required: true 
    },

    isAvailable: { 
        type: Boolean, 
        default: false 
    },

    userid: { 
        type: String,
        required: true 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('items',ItemsSchema)