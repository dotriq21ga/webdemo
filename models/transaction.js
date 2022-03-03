const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  name :{
    type : String ,
  },
  name2 : {
    type : String ,
  },
  money : {
    type : Number
  },
});

const Transaction  = mongoose.model('Transaction', TransactionSchema);
module.exports.Transaction = Transaction ;