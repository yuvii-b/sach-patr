const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const LocalStratergy=require('passport-local');
const errorHandler=require('./utilities/errorHandler');
const expressError=require('./utilities/customError');
const certificateModel=require('./models/Certificate');
const uploadModel=require('./models/uploads');
const User=require('./models/user');
const uploadRoutes=require('./routes/uploadRoutes');
const certificatesRoutes=require('./routes/certificatesRoutes');
const userRoutes=require('./routes/users');


mongoose.connect('mongodb://localhost:27017/CrediBull', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connection successful!");
})
.catch((err) => {
  console.error(" MongoDB connection error:", err);
});

const app=express();

const sessionconfig = {
  secret: 'helloworldthisisthebest',
  saveUninitialized: true,
  resave: false,
  cookie: {
   //httpOnly is not working rather use this
   httpOnly: true,
    secure:false,
    maxAge: 1000 * 60 * 60 * 24 * 7 
  }
};
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session(sessionconfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/',uploadRoutes);
app.use('/',certificatesRoutes);
app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.send('home');
})

//route to check if the ocr details are present in the database
app.get('/test',errorHandler(async(req,res)=>{
    //mock data expected to recieve from OCR
    const input= {
    issuedTo: "Arun K",
    course: "Artificial Intelligence Basics",
    issuedBy: "PSG College of Technology",
    certificateId: "CERT-008",
    issueDate: new Date("2025-07-22")
  }
    const output=await certificateModel.find(input);
    if(output.length!==0){
        res.json({
            success:'yes',
            output:output
        })
    }
    else{
        res.json({
            success:'no',
            output:null
        })
    }
}))






//to return the stats for each institute


//to get the overall stats for the HED dashboard
app.get('/api/stats',errorHandler(async(req,res)=>{
 const stats = await uploadModel.aggregate([
  {
    $group: {
      _id: null,
      totalCertificates: { $sum: 1 },
      verified: { $sum: { $cond: [{ $eq: ["$flag", "pass"] }, 1, 0] } },
      fakeDetected: { $sum: { $cond: [{ $eq: ["$flag", "fail"] }, 1, 0] } },
      suspicious: { $sum: { $cond: [{ $eq: ["$flag", "suspicious"] }, 1, 0] } }
    }
  },
  { $project: { _id: 0 } }
]);
  res.json(stats);
}))



//to check the contents of the database 
app.get('/display',errorHandler(async(req,res)=>{
    const data=await certificateModel.find({});
    res.json(data);
}))
 
//to catch all the other routes
app.all('*wildcard',(req,res)=>{
    throw new expressError('page not found',404);
})

//error handling middleware
app.use((err,req,res,next)=>{
    const {statuscode=500}=err;
    const message=err.message;
    if(message){
        err.message='something went wrong';
    }
    res.status(statuscode).json({
        success:false,
        error:{
            message,
            statuscode,
            stack:err.stack
        }
    });
});

app.listen(3000,()=>{
    console.log('listening on port 3000');
})
/*name*/