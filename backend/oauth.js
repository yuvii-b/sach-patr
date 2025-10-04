const express = require("express")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = 3000

app.get("/auth/google",(req,res) => {
    const scope = ["openid", "email", "profile"].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `access_type=offline`;

    res.redirect(authUrl)
})

app.get("/auth/google/callback", async(req,res) => {
    const code = req.query.code

    try{
        const tokenRes = await axios.post("https://oauth2.googleapis.com/token",{code, client_id: process.env.GOOGLE_CLIENT_ID,client_secret: process.env.CLIENT_SECRET,redirect_uri:process.env.REDIRECT_URI,grant_type: "authorization_code"});
        const {id_token, access_token} = tokenRes.data;

        const userRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {headers: {Authorization: `Bearer ${access_token}`}})
        const user = userRes.data;

        res.json(user);

    }catch(err){
        console.error(err.response?.data || err.message);
        res.status(500).send("Authentication failed");
    }

})
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});