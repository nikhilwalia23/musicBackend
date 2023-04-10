require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
//Load Routes in Main App
const musicRoutes = require("./Routes/music.js")
const authRoutes = require("./Routes/auth.js");
const groupRoutes = require("./Routes/group.js");
const app = express();
//Enable Request from all domain temprart
app.use(cors())

app.use(bodyParser.json()); 
app.use("/music",musicRoutes);
app.use("",authRoutes);
app.use("/group",groupRoutes);
app.get("/hello",(req,res)=> 
{
    return res.json({"msg":"hlo from backend"});
})

//Make DataBase Connection
mongoose.connect(process.env.MONGO_CLUSTER,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( (sucess)=>console.log("Database Connected")).catch((err)=> {console.log("somethign wrong with database connection")});


app.listen(process.env.PORT,() => {console.log(`Server is listing on Port ${process.env.PORT}`)});