const express = require("express");
const passport=require('passport');
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const User=require('../models/user');
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {validateSignup,validateLogin}=require('../middlewares');

const router = express.Router();

router.post('/register',validateSignup,errorHandler(async (req,res)=>{
    try{
    const {username,password,email,role}=req.body;
    const newuser=new User({username,email,role});
    const registereduser= await User.register(newuser,password);

    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/loginCheck');
    })//this .login function is used to login afer registering the user and it takes a call back as the second argument

    }catch(e){
        
        //console.log(e.message);
        res.redirect('/register');
    }
}))

router.post('/login',validateLogin,passport.authenticate('local'),(req,res)=>{
    res.redirect('/loginCheck'); 
})

router.get('/logout',errorHandler(async (req,res)=>{
    await req.logout((err)=>{
        if(!err){
            
            res.redirect('/display');
        }
        else{
            console.log(err.message);
            res.redirect('/');
        }
    });
}))


router.get('/loginCheck',(req,res)=>{
    res.send(req.user);
})

module.exports=router;