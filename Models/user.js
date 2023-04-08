var mongoose = require("mongoose");
const crypto = require('crypto');
var ObjectId=mongoose.ObjectId;
const userSchema = new mongoose.Schema({
    username:
    {
        type: String,
        unique:true,
        required: true
    },
    name :
    {
        type: String,
        required: true,
        maxlength: 32,
    },
    email :
    {
        type: String,
        unique: true,
    },
    number : 
    {
        type: String,
        maxlength: 10,
        required: true,
        unique: true,
        trim: true
    },
    encry_password :
    {
        type: String,
        required: true,
    },
    salt :
    {
        type : String,
    },
    resetString: 
    {
        type: String,
        default:""
    },
    isGroup:
    {
        type: Map,
        of: Boolean
    },
});
//Virtual Methods Set Up and Salt value and Encrypt the password before Saving into the Database
userSchema.virtual("password").set(function(password)
{
    this._password=password;
    this.salt=crypto.randomUUID();
    this.encry_password=this.securePassword(password);
}).get(function()
{
    return this._password;
})
userSchema.methods=
{
    securePassword: function(plainPassword)
    {
        if(plainPassword==""){return plainPassword;}
        else
        {
            try
            {
                const hash = crypto.createHmac('sha256', plainPassword)
               .update(this.salt)
               .digest('hex');
               return hash;
            }
            catch(err)
            {
                return "Something Wrong With Crypto";
            }
        }
    },
    authenticate: function(plainPassword)
    {
        return this.securePassword(plainPassword)===this.encry_password;
    }
};

const User = mongoose.model("User",userSchema);
module.exports = {User};