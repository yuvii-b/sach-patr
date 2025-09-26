const mongoose=require('mongoose');
const Schema=mongoose.Schema;

uploadSchema=new Schema({
    certificateId:{
        unique:true,
        type:String,
        min:1
    },
    issuedBy:{
        type:String,
        min:0
    },
    issuedDate:{
        type:Date
    },
    uploadDate:{
        type:Date
    },
    realPercent:{
        type:Number,
        min:0,
        max:1
    },
    textConsistency:{
        type:String,
        enum:['pass','suspicious','fail']
    },
    metadataValidation:{
        type:String,
        enum:['pass','suspicious','fail']
    },
    logoMismatch:{
        type:String,
        enum:['pass','suspicious','fail'],
    },
    digitalSignature:{
        type:String,
        enum:['pass','suspicious','fail']
    },
    flag:{
        type:String,
        enum:['pass','suspicious','fail']
    }
})

const Upload=new mongoose.model('Upload',uploadSchema);
module.exports=Upload;