const pool = require("../config/db");

var Certificate
async function createCertificate(){
  const query=`CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  institute VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)`

 Certificate=await pool.query(query);
}

try{
    createCertificate();
}catch(e){
    throw new
}





module.exports = Certificate;