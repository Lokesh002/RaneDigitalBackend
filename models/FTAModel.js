const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const FTASchema=mongoose.Schema({


description:{
    type:String,
    required:true
},

photoURL:{
    type:String
},
parent:{type:mongoose.Schema.Types.ObjectId, ref: 'FTA'},
ancestors:[],
raisingPerson: {type:mongoose.Schema.Types.ObjectId, ref: 'Users'},


machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},

line:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'},



},{timestamps:true});
 const FTAdb=mongoose.model('FTA',FTASchema);
module.exports=FTAdb;