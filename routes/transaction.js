const express = require('express');
const router = express.Router();
const { Transaction} = require('../models/transaction');
const { User } = require('../models/user');
const {startSession} = require('mongoose');

router.get('/:username', function(req, res){
    const query = req.body.username;

    User.findOne({username: query} ,function(err , users){
        try{
            if(users.admin ==true){
                res.render('gd.pug',{
                    users : users
                })
            } 
            else{
                res.redirect('/')
            }
        }
        catch(err){
            res.redirect('/')
        }
    })
});
router.post('/:username', async (req ,res)=>{
    const session = await startSession();
    try { 
        const name = req.params.username ;
        const name2 = req.body.totk ;
        const money = req.body.money ;
        session.startTransaction();
        const to  = await User.findOneAndUpdate({
            username : name2
        }, {
            $inc : {money : money}
        },{session , new : true})
        await session.commitTransaction();
        session.endSession()
        const ls = new Transaction();
        ls.name = name ;
        ls.name2 = name2;
        ls.money = money ;
        ls.save(function(err){
            if(err){
              console.log(err)
            }
            else{
              res.redirect("/");
            }
          })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        return res.json({
            msg : error
        })
    }
})



module.exports = router;