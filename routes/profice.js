const express = require('express');
const router = express.Router();
const { Account} = require('../models/account');
const { User } = require('../models/user');

router.get('/:username', function(req, res){
    const query = req.params.username;
    Account.find({buy: query} ,function(err , accounts){
        res.render('profice.pug',{
          accounts : accounts
        })
    })
});

module.exports = router;