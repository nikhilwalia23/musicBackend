var mongoose = require("mongoose");
var ObjectId=mongoose.ObjectId;
const songSchema = new mongoose.Schema({
   release_date: 
   {
    type: Date,
    required: true
   },
   lyrics:
   {
     type: String
   },
   name:
   {
     type: String,
     required: true
   },
   singer: 
   {
      type: String,
      reqired: true
   },
   pop:
   {
     type: Boolean,
   },
   rock:
   {
    type: Boolean,
   },
   hip_hop:
   {
    type: Boolean
   }
    
},{ timestamps: true });
const Song = mongoose.model('Song',songSchema);
module.exports = {Song};