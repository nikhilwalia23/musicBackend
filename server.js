require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//Load Routes in Main App
const musicRoutes = require("./Routes/music.js")
const authRoutes = require("./Routes/auth.js");
const app = express();
app.use(bodyParser.json()); 
app.use("/music",musicRoutes);
app.use("",authRoutes);
app.get("/hello",(req,res)=> 
{
    return res.json({"msg":"hlo from backend"});
})

//Make DataBase Connection
mongoose.connect(process.env.MONGO_CLUSTER,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Database Connected"));

app.listen(process.env.PORT,() => {console.log(`Server is listing on Port ${process.env.PORT}`)});