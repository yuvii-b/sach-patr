const express=require('express');
const errorHandler=require('./utilities/errorHandler');
const expressError=require('./utilities/customError');
const app=express();

app.get('/',(req,res)=>{
    res.send('home');
})

app.get('/test',errorHandler((req,res)=>{
    /*const input={name:"kaushal",course:"be cse",institute:"MIT chennai"};
    const a=10/0;
    res.send(a);*/
    throw new expressError('something went wrong',300);
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