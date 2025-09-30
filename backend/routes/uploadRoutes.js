const express = require("express");
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const router = express.Router();
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {isLoggedIn,authUser,authAdmin, authInstitute}=require('../middlewares');



//to get the stats for the given institute(now only supports one institute)
router.get('/api/uploads/institute/stats',isLoggedIn,authAdmin,errorHandler(async (req,res)=>{
  //const {instituteName}=req.params;
  const instituteName="Smart India Institute of Technology"
  const stats = await uploadModel.aggregate([
  { $match: { issuedBy: instituteName } },
  {
    $group: {
      _id: "$issuedBy",
      totalCertificates: { $sum: 1 },
      verified: { $sum: { $cond: [{ $eq: ["$flag", "pass"] }, 1, 0] } },
      fakeDetected: { $sum: { $cond: [{ $eq: ["$flag", "fail"] }, 1, 0] } },
      suspicious: { $sum: { $cond: [{ $eq: ["$flag", "suspicious"] }, 1, 0] } }
    }
  }]);

  res.json(stats);

}))

//returning the uploaded certificates by the user for each institute
router.get('/api/uploads/institute',isLoggedIn,authInstitute,errorHandler(async(req,res)=>{
  //const {instituteName}=req.params;
  
  const instituteName="Smart India Institute of Technology";
  const uploads=await uploadModel.find({issuedBy:instituteName});
  res.json({
    length:uploads.length,
    uploadedCertificates:uploads
  })

}))

//to get the upload details of a particular institute(for now only one) 
router.get('/api/uploads/user/latest',isLoggedIn,authUser,errorHandler(async(req,res)=>{
  const user=req.user._id;
  const data=await uploadModel.find({issuedTo:user}).populate('issuedTo');
  res.json({data});
}))

/*to get the latest upload of the user (often used to give the report for the uploaded certificate after 
the execution of /api/uploads/user/update)*/
router.get('/api/uploads/user/current',isLoggedIn,authUser,errorHandler(async(req,res)=>{
  const user=req.user;
  const data=await uploadModel.findOne({issuedTo:user}).populate('issuedTo').sort({uploadDate:-1})
  res.json({data});
}))

//to fetch the ocr details of the uploaded certificate by the user and updating it in uploads schema
router.post('/api/uploads/user/update',isLoggedIn,authUser,errorHandler(async(req,res)=>{
  
  const input={
  certificateId: "CERT-UP-016",
  issuedBy: "Smart India Institute of Technology",
  issuedDate: new Date("2023-11-05"),
  uploadDate: new Date("2023-11-06"),
  realPercent: 0.92,
  textConsistency: "pass",
  metadataValidation: "pass",
  logoMismatch: "suspicious",
  digitalSignature: "pass",
  flag: "pass"
}

input["issuedTo"]=req.user;
const updatedDocs=await uploadModel.insertOne({input},)

}))
module.exports=router;
