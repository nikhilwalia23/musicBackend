require('dotenv').config();
const express = require("express");

//Load Routes in Main App
const musicRoutes = require("./Routes/music.js")
const app = express();
app.use("/music",musicRoutes);
app.get("/hello",(req,res)=> 
{
    return res.json({"msg":"hlo from backend"});
})
app.listen(process.env.PORT,() => {console.log(`Server is listing on Port ${process.env.PORT}`)});