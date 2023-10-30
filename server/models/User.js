const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    companyname: {
        type: String,
        required: true,
      },
      Businesstype: {
        type: String,
        required: true,
      },
      CurrencyType: {
        type: String,
        required: true,
      },
      FirstName: {
        type: String,
        required: true,
      },
      LastName: {
        type: String,
      },
      password:{
          type:String,
          required:true
      },
      email: {
        type: String,
        required: true,
      },
});

module.exports = mongoose.model('user',UserSchema)