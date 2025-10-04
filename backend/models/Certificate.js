const mongoose=require('mongoose');
const User=require('./user');
const Schema=mongoose.Schema;

certificateSchema=new Schema({
    issuedTo:{
        type:String,
        max:100,
        min:1
    },
    course:{
        type:String,
        max:100,
        min:1
    },
    issuedBy:{
        type:mongoose.Types.ObjectId,
        ref:User
    },
    certificateId:{
        type:String,
        unique:true
    },
    issueDate:{
        type:Date
    }
});

const certificateModel=mongoose.model('Certificate',certificateSchema);
module.exports=certificateModel;