const express = require('express');
const router = express.Router();
const { Account} = require('../models/account');
const { Option } = require('../models/option');
const { User } = require('../models/user')
const {Transaction} = require('../models/transaction')

router.get('/quantriweb',async(req,res)=>{
    const options = await Option.find({});
    const transactions = await Transaction.find({}); 
    res.render('admin.pug',{
        transactions : transactions ,
        options : options
    })
})


module.exports = router;