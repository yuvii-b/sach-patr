const{signupSchema,loginSchema}=require('./validator/authValidator');
const customError=require('./utilities/customError');

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log("you must be logged in first");
        return res.redirect('/');
    }
    next();
}

const validateSignup=(req,res,next)=>{
    const{error}=signupSchema.validate(req.body);
    if(error){
        throw new customError(error.details[o].message,400);
    }
    else{
        return next();
    }
}

const validateLogin=(req,res,next)=>{
    const{error}=loginSchema.validate(req.body);
    if(error){
        throw new customError(error.details[0].message,400);
    }else{
        return next();
    }
}

const authUser=(req,res,next)=>{
    if(req.user.role=="user"){
        return next();
    }else{
        throw new customError("not authorized to use this route",403);
    }
}

const authAdmin=(req,res,next)=>{
    if(req.user.role=="admin"){
        return next();
    }else{
        throw new customError("not authorized to use this route",403);
    }
}

const authInstitute=(req,res,next)=>{
    if(req.user.role=="institute"){
        return next();
    }else{
        throw new customError("not authorized to use this route",403);
    }
}



module.exports={isLoggedIn,validateSignup,validateLogin,authUser,authAdmin,authInstitute};