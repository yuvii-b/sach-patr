const mongoose=require('mongoose');
const uploadModel=require('../models/uploads');
const data=require('./uploadData');

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
        await uploadModel.deleteMany({});
        const insertedDocs=await uploadModel.insertMany(data);
        console.log(insertedDocs);
    }catch(e){
        console.log(e);
    }
   
}
manageSeeds();