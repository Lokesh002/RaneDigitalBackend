const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const LineSchema=mongoose.Schema({
name:{
    type:String,
    required:true
},

machine:[{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'}]


},{timestamps:true});
 const lineDB=mongoose.model('Lines',LineSchema);
module.exports=lineDB;