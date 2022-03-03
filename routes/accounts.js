const express = require('express');
const router = express.Router();
const { Account} = require('../models/account');
const { Option } = require('../models/option');
const {User} = require('../models/user')
const multer = require('multer');
const {startSession} = require('mongoose')


const fileStorageEngine = multer.diskStorage({
    destination : (req , file , cb) => {
      cb(null , "uploads");
    },
    filename : (req , file , cb) => {
      cb(null , file.originalname);
    },
  });
  
const upload = multer({ storage : fileStorageEngine });


router.get('/add/:slug' , function(req , res){
  const query = req.params.slug ;
  Option.findOne({slug : query},function(err , options){
    if (err) {
      console.log(err);
    } else {
      res.render('addtk.pug', {
        options : options
      })
    }
  })
})
router.post('/add/:slug' , upload.array('images', 12) , function(req , res){
  const query = req.params.slug;
  const account =  new Account();
  account.title = req.body.title;
  account.money = req.body.money;
  account.name = req.body.name ;
  account.slug= query;
  const listFile = req.files ;
  account.image = listFile.map((file) => file.originalname) ;
  account.save(function(err){
    if(err){
      console.log(err)
    }
    else{
      res.redirect("/");
    }
  })
})
router.get('/:id' , function(req , res){
  const query = req.params.id;
  Account.findOne({_id : query} ,function(err , accounts){
    res.render('chitiet.pug',{
      accounts : accounts
    })
  })
})

router.post('/:id', async (req,res)=>{
  const att = req.user.username;
  const qr = req.params.id;
  console.log(qr)
  console.log(att)
  const fo = await Account.findOneAndUpdate({_id:qr} , {buy:att})
  console.log(fo.money)
  const session = await startSession();

  try { 
    session.startTransaction();
    const from  = await User.findOneAndUpdate({
        username: att
    }, {
        $inc : {money : -fo.money}
    },{session , new : true})

    await session.commitTransaction();
    session.endSession()
    return res.json({
        msg : "ok"
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