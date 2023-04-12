var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
let requestSchema = new mongoose.Schema({
    group: {type: ObjectId,ref:'Group'},
    reciver: {type:ObjectId,ref:'User'}
});
let Request = mongoose.model('Request',requestSchema);
module.exports = {Request};