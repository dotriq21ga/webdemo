const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin:{
    type: Boolean,
    default : false
  },
  money : {
    type : Number,
    default : 1000 ,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports.User = User;