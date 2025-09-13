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