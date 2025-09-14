const express=require('express');
const mongoose=require('mongoose');
const errorHandler=require('./utilities/errorHandler');
const expressError=require('./utilities/customError');
const certificateModel=require('./models/certificate');

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

app.get('/',(req,res)=>{
    res.send('home');
})

//route to check if the ocr details are present in the database
app.get('/test',errorHandler(async(req,res)=>{
    //mock data expected to recieve from OCR
    const input={name:"meera iyer",course:"ma english literature",institute:"madras institute of techonology"};
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

app.get('/institute/upload',errorHandler(async (req,res)=>{
    //mock data expected from OCR
    const input =[{
    name: "aarav sharma",
    course: "btech computer science",
    issueDate: new Date("2023-07-15"),
    certificateId: "cert20230001",
    institute: "indian institute of technology delhi"
  },
  {
    name: "isha patel",
    course: "mba finance",
    issueDate: new Date("2022-11-20"),
    certificateId: "cert20220002",
    institute: "indian institute of management ahmedabad"
  },
  {
    name: "rohan verma",
    course: "msc data science",
    issueDate: new Date("2023-01-10"),
    certificateId: "cert20230003",
    institute: "indian statistical institute kolkata"
  },
  {
    name: "priya nair",
    course: "bcom accounting",
    issueDate: new Date("2021-08-05"),
    certificateId: "cert20210004",
    institute: "st xaviers college mumbai"
  }]

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