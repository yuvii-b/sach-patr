const mongoose=require('mongoose');
const certificateModel=require('../models/certificate');
const data=require('./data');

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

async function manageSeeds(){
    try{
        await certificateModel.deleteMany({});
        const insertedDocs=await certificateModel.insertMany(data);
        console.log(insertedDocs);
    }catch(e){
        console.log(e);
    }
   
}

manageSeeds();