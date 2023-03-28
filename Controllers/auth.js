const { User } = require("../Models/user");
const jwt = require("jsonwebtoken");
let singUp = async function  (req, res){
    //Check Before Creating User
    const user = new User(req.body);

    user.save().then( (ur)=> 
    {
        return res.status(200).json({"msg":"User Account Created SucessFully"});
    }
    ).catch(err => 
    {
        return res.status(200).json({"error":"Someting wrong with input"})
    });
   
}
let login = (req, res) => {
    const username = req.body.username;
    const ps = req.body.password;
    User.findOne({username}).exec().then((user)=> 
    {
        if (!user) {
            return res.status(404).json({ "error": "User Does not Account" });
        }
        else {
            const { name, number,email} = user;
            const id = user._id;
            if (user.authenticate(ps)) {
                jwt.sign({ id }, process.env.HASHING_KEY, { algorithm: 'HS256' }, function(err, token) {
                    if(err)
                    {
                        return res.status(400).json(err);
                    }
                    else
                    {
                        return res.status(200).json({id,token,name,email,number});
                    }
                  });
            }
            else {
                return res.status(404).json({ "error": "UserId and Password Does not Matach" });
            }
        }
    }).catch((err)=> 
    {
        return res.status(422).json({"error":"Invalid User Data"});
    });
}
let isLogin = (req, res, next) => {
    const token= req.body.token;
    jwt.verify(token, process.env.HASHING_KEY, (err, curr) => {
        if (err) {
            return res.send(err);
        }
        else {
            if (curr.id == req.body.id) {
                next();
            }
            else {
                return res.status(401).json({ "error": "Acess Denied" });
            }
        }
    });
}
let checkLogin = (req, res) => {

    res.send("You are logged in");
}
module.exports = {singUp,login,isLogin,checkLogin};