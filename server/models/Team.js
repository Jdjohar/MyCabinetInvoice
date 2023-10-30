const mongoose = require('mongoose');
const {Schema} = mongoose;

const TeamSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true
    },
    userid:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('team',TeamSchema)