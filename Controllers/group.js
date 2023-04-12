const { mongo } = require("mongoose");
const {Group} = require("../Models/group");
const {createClient} = require("redis");
const {Request} = require("../Models/request")

/*

REDIS SET IS NOT WORKING THIS ISSUE TO USE REQEST SENT AND ACCEPT FEATURE 


MOTHER FUCKER REDIS CLIENT

*/



const client = createClient(
{
    url: process.env.REDIS_URL
});

//Make Connection to Redis Cache
client.connect().then((msg)=> 
{
    console.log("Connected to Redis Server on Render");
}).catch((err)=> 
{
    console.log(err);
})
//Create Group
let createGroup = (req,res) => 
{
    const {id,name} = req.body;
    let users = req.body.users;
    let owner = id;
    let group = new Group({name,users,owner});
    group.save().then((gr)=>
    {
        if(gr)
        {
            return res.status(200).json({"msg":"Group Has been Successfully crated"})
        }
        else
        {
            return res.status(400).json({"error":"Check you Payload"});
        }
    }).catch((error)=> 
    {
        return res.status(400).json(error);
    })
    
}


//Fetch all Group Create by current user
let fetchGroups = (req,res) => 
{
    let owner = req.body.id;
    Group.find({owner}).then(
        (groups) => 
        {
            if(groups)
            {
                return res.status(200).json(groups);
            }
            else
            {
                return res.status(404).json({"error":"You have not crated any grups yet"})
            }
        }
    ).catch((err)=> 
    {
        return res.status(400).json({err});
    })
}
let addMebmerToGroup = (req,res) => 
{
    let member = req.body.memberUserId;
    let groupid = req.body.groupid;
    
    Group.findById(groupid).then((group)=>
    {
        if(group)
        {
            let members = group.users;
            for(ind in members)
            {
                let str = JSON.stringify(members[ind]);
                str = str.slice(1,-1);
                console.log(str);
                if(member==str)
                {
                    return res.status(200).json({"error":"User Allready Added to Current Group"})
                }
            }
            sendRequest(groupid,member,res);
        }
        else
        {
            return res.status(404).json({"error":"Invalid Group Id"});
        }
    }).catch((error)=> 
    {
        return res.status(400).json({error});
    });
}
//Remove Group Member
//Accept Group Request
let AcceptRequest = (req,res) => 
{
    let member = req.body.id;
    let groupid = req.body.groupid;
    let requestId = req.body.requestId;
    Group.findById(groupid).then((group)=> 
    {
        if(!group)
        {
            return res.status(404).json({"error":"Gruop Doest Not Exists"})
        }
        group.users.push(member);
        group.save().then((g)=> 
        {
            Request.findByIdAndDelete(requestId).then((d)=> 
            {
                return res.status(202).json({"msg":"Request Accepted"});
            }).catch((err)=> 
            {
                return res.status(400).json({"error":"Something Wrong saving at controllers/group.js 128"});
            });
           
            
        }).catch((err) => 
        {
            return res.status(400).json({"error":err});
        });
    }).catch((err) => 
    {
        return res.status(400).json({"error":err});
    });
}
//Fetch Pending Group Request
//Fetch Group Details Using Group Id
let groupDetails = (req,res) => 
{
    let groupid = req.body.groupid;
    Group.findById(groupid).then((gr) => 
    {
        if(!gr)
        {
            return res.status(404).json({"error":"No Group is Found With Given Id"});
        }
        else
        {
            return res.status(200).json(gr);
        }
    }).catch((err)=> 
    {
        return res.status(400).json({"error":err});
    })
}
//Middlware for Check if current User is Owner of this Group  Or not
let isOwner = (req,res,next) => 
{
    let owner = req.body.id;
    let groupid = req.body.groupid;
    Group.findById(groupid).then((group)=> 
    {
        //check
        str = JSON.stringify(group.owner);
        str = str.slice(1,-1);
        if(str!=owner)
        {
            return res.status(401).json({"error":"you are not owner of this group"});
        }
        next();
    }).catch((err)=>
    {
        return res.status(400).json({"error":"Internal Server Error"});
    })
}
let sendRequest = (groupId,member,res) => 
{
    Request.find({group:groupId,reciver:member}).then((request)=> 
    {
        
        if(request.length!=0)
        {
            return res.status(400).json({"msg":"Request Allready Have Been Sent"})
        }
        let rq = new Request({group:groupId,reciver:member});
        rq.save().then((r)=> 
        {
            console.log("Request crated");
            return res.status(400).json({"msg":"Request Sent SucessFully"})
        }).catch((err)=> {return res.status(400).json({"error":err})});
    }).catch((err)=> {return res.status(400).json({"error":err})})
  
}
let fetchPendingRequest = (req,res) => 
{
    //Fetch Pending Request For current user from Redis Cache set DataStrucutre
    // let id = req.body.id;
    // client.SCARD('fdfad',(err,reply)=> 
    // {
    //     return res.status(200).json({"msg":"ok ok .."});
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {
           
    //         console.log(reply);
    //     }
    // })
    
   Request.find({reciver:req.body.id}).then((requests)=> 
   {
      if(requests.length==0)
      {
          return res.status(200).json({"msg":"No Pending Request"});
      }
      else
      {
        
        return res.status(200).json({requests});
      }
   }).catch((err)=> 
   {
      return res.status(400).json({"error":err});
   });
}
module.exports = {createGroup,fetchGroups,addMebmerToGroup,groupDetails,isOwner,AcceptRequest,fetchPendingRequest};