require('dotenv').config();
const express = require("express");
const app = express();
app.get("/hello",(req,res)=> 
{
    return res.json({"msg":"hlo from backend"});
})
app.listen(process.env.PORT,() => {console.log(`Server is listing on Port ${process.env.PORT}`)});