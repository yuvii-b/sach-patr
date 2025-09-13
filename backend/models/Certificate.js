const mongoose=require('mongoose');
const Schema=mongoose.Schema;

certificateSchema=new Schema({
    name:{
        type:String,
        max:100,
        min:1
    },
    course:{
        type:String,
        max:100,
        min:1
    },
    institute:{
        type:String,
        max:200,
        min:1
    },
    certificateId:{
        type:String,
    },
    issueDate:{
        type:Date
    }
});

const certificateModel=mongoose.model('certificate',certificateSchema);
module.exports=certificateModel;