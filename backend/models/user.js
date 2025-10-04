const mongoose=require("mongoose");
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        enum:['user','institute','admin']
    }
});

UserSchema.plugin(passportLocalMongoose);

const UserModel=mongoose.model('User',UserSchema);
module.exports=UserModel;