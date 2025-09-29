const express = require("express");
const errorHandler=require('../utilities/errorHandler');
const expressError=require('../utilities/customError');
const router = express.Router();
const certificateModel=require('../models/Certificate');
const uploadModel=require('../models/uploads');
const {isLoggedIn,authUser,authAdmin}=require('../middlewares');

//returning the uploaded certificates for each institute
router.get('/api/upload/institute/:instituteName',isLoggedIn,authUser,errorHandler(async(req,res)=>{
  const {instituteName}=req.params;
  
  const uploads=await uploadModel.find({issuedBy:instituteName});
  res.json({
    length:uploads.length,
    uploadedCertificates:uploads
  })

}))

router.get('/api/upload/institute/:instituteName/stats',isLoggedIn,authAdmin,errorHandler(async (req,res)=>{
  const {instituteName}=req.params;
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

module.exports=router;
