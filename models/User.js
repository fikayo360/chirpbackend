const mongoose = require('mongoose');
const validator = require('validator');


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
  },
  resettoken: {
    type:String
  },
  phonenumber: {
    type:String,
    minlength: 11
  },
  friends: {
    type:Array
  },
  profilepic: {
    type:String
  },
  Bio: {
    type:String
  },
  country:{
    type: String
  },
  state:{
    type:String
  },
  zipcode:{
    type:String
  }
},
{ timestamps: true }
);



module.exports = mongoose.model('User', UserSchema);