var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
const groupSchema = new mongoose.Schema({
   users: [{type: ObjectId,ref: 'User'}],
   owner: {type:ObjectId,ref:'User'},
   songsList: [{type: ObjectId,ref: 'Song'}]
    
},{ timestamps: true });
const Group = mongoose.model('Group',songSchema);
module.exports = {Group};