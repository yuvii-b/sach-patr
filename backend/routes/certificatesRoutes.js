const express = require("express");
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const router = express.Router();
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {authInstitute,isLoggedIn}=require('../middlewares');


//used by institutional login to upload data in bulk in certificate schema
router.get('/institute/update',isLoggedIn,authInstitute,errorHandler(async (req,res)=>{

  //expected from the ocr
const input = [
  {
    issuedTo: "Arjun Kumar",
    course: "B.Tech Computer Science",
    certificateId: "CERT-SIIT-001",
    issueDate: new Date("2023-06-15"),
  },
  {
    issuedTo: "Priya Sharma",
    course: "B.Tech Information Technology",
    certificateId: "CERT-SIIT-002",
    issueDate: new Date("2023-07-10"),
  },
  {
    issuedTo: "Ravi Patel",
    course: "B.Tech Electronics and Communication",
    certificateId: "CERT-SIIT-003",
    issueDate: new Date("2023-08-05"),
  },
  {
    issuedTo: "Sneha Nair",
    course: "MBA Business Analytics",
    certificateId: "CERT-SIIT-004",
    issueDate: new Date("2023-09-20"),
  },
  {
    issuedTo: "Vikram Reddy",
    course: "M.Tech Artificial Intelligence",
    certificateId: "CERT-SIIT-005",
    issueDate: new Date("2023-10-12"),
  }
];

for(var i=0;i<input.length;i++){
  input[i]["issuedTo"]=req.user;
}


  const insertedDocs=await certificateModel.insertMany(input,{ordered:false});
  if(insertedDocs.length==input.length){
    res.json({
        success:'yes',
        insertedCount:insertedDocs.length,
        insertedData:insertedDocs
    })
  }else{
    res.json({
        success:'no',
        insertedCount:insertedDocs.length,
        insertedData:insertedDocs
    })
  }
}))



module.exports=router;


