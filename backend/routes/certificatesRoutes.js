const express = require("express");
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const router = express.Router();
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {authInstitute}=require('../middlewares');


router.get('/institute/update',authInstitute,errorHandler(async (req,res)=>{
    //mock data expected from OCR
    const input = [
  {
    issuedTo: "Aarav Sharma",
    course: "B.Tech Computer Science",
    issuedBy: "Indian Institute of Technology, Bombay",
    certificateId: "IITB-CSE-2025-001",
    issueDate: new Date("2025-06-15")
  },
  {
    issuedTo: "Priya Ramesh",
    course: "MBA in Finance",
    issuedBy: "Indian Institute of Management, Ahmedabad",
    certificateId: "IIMA-MBA-2025-002",
    issueDate: new Date("2025-03-20")
  },
  {
    issuedTo: "Rahul Verma",
    course: "B.Sc Physics",
    issuedBy: "University of Delhi",
    certificateId: "DU-PHY-2025-003",
    issueDate: new Date("2025-07-01")
  },
  {
    issuedTo: "Meena Krishnan",
    course: "M.Tech Artificial Intelligence",
    issuedBy: "Anna University, Chennai",
    certificateId: "AU-AI-2025-004",
    issueDate: new Date("2025-08-10")
  },
  {
    issuedTo: "Vikram Patel",
    course: "B.Com Accounting",
    issuedBy: "University of Mumbai",
    certificateId: "MU-COM-2025-005",
    issueDate: new Date("2025-05-25")
  },
  {
    issuedTo: "Sneha Iyer",
    course: "M.Sc Data Science",
    issuedBy: "Indian Statistical Institute, Kolkata",
    certificateId: "ISI-DS-2025-006",
    issueDate: new Date("2025-04-05")
  }
];

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


