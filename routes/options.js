const express = require('express');
const router = express.Router();
const { Option } = require('../models/option');
const { Account} = require('../models/account');
const { User } = require('../models/user');
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

router.get('/add', function(req, res){
  res.render('addOption.pug');
});
router.post('/add', upload.single('image'), (req, res) =>{
  const option = new Option();
  option.game = req.body.game;
  option.img = req.file.originalname ;
  option.save(function(err){
    if(err){
      console.log(err)
    }
    else{
      res.redirect("/");
    }
  })
})
router.get('/edit/:id', function(req, res){
  Option.findById(req.params.id,function(err , options){
    res.render('editOption.pug',{
      options : options
    })
  })
});
router.post('/edit/:id', upload.single('image'), (req, res) =>{
  const option = {};
  option.game = req.body.game;
  option.img = req.file.originalname ;
  const query = {_id : req.params.id}
  Option.updateOne(query , option ,function(err){
    if(err){
      console.log(err)
    }
    else{
      res.redirect("/");
    }
  })
})
router.delete('/:id', function(req , res , next){
  const query = {_id : req.params.id}
  Option.deleteOne(query)
    .then(()=> res.redirect('/'))
    .catch(next)
})
router.get('/account/:slug', function(req,res){
  const query = req.params.slug ;
  Account.find({slug : query} ,function(err , accounts){
    res.render('tkGame.pug',{
      accounts : accounts
    })
  })
})
router.post('/account/:slug', async (req,res)=>{
  const att = req.user.username;
  const qr = req.body.id;
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