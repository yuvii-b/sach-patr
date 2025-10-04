const express = require("express");
const passport=require('passport');
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const User=require('../models/user');
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {validateSignup,validateLogin}=require('../middlewares');

const router = express.Router();

//called by frontend with username,password,email,role in the request body 
router.post('/register',validateSignup,errorHandler(async (req,res)=>{
    try{
    const {username,password,email,role}=req.body;
    const newuser=new User({username,email,role});
    const registereduser= await User.register(newuser,password);

    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/loginCheck');//to be filled by the url of the frontend
    })//this .login function is used to login afer registering the user and it takes a call back as the second argument

    }catch(e){
        res.redirect('/register');
    }
}))

//called by the frontend to login a user after signup username and password must be in request body
/*router.post(
  '/login',
  validateLogin,
  passport.authenticate('local', {
    successRedirect: '/loginCheck',   // frontend URL to redirect on success
    failureRedirect: '/login',        

  })
);*/

router.post('/login', validateLogin, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // let errorHandler middleware handle server errors
    }
    if (!user) {
      // Login failed
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password"
      });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Success: send user JSON (or JWT if you switch later)
      return res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  })(req, res, next);
});





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

//temporary route used for checking if the user has been loggedin or signed up
router.get('/loginCheck',(req,res)=>{
    res.send(req.user);
})

module.exports=router;