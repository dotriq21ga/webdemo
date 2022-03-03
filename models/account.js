const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  name :{
    type : String ,
  },
  title: {
    type : String,
  },
  image : {
    type : Array ,
  },
  money : {
    type : Number
  },
  buy : {
    type : String,
    default : null
  }, 
  slug : {
    type : String,
  }
});


const Account = mongoose.model('Account', AccountSchema);
module.exports.Account = Account;