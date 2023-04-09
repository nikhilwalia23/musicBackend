const { mongo } = require("mongoose");
const {Group} = require("../Models/group");
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
            group.users.push(member);
            group.save().then((g)=> 
            {
                //Push reqest to readis Catch and after user accept the request push to databse
                //do this latter
               if(g){return res.status(200).json({"msg":"User Added SucessFully"});}
            }).catch((err) => 
            {
                return res.status(400).json({err});
            });
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
module.exports = {createGroup,fetchGroups,addMebmerToGroup,groupDetails,isOwner};