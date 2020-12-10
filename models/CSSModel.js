const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const CSSSchema=mongoose.Schema({
revision:{
    type:Number,
    required:true
},
line:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'},

machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'}


},{timestamps:true});
 const CSSdb=mongoose.model('CSS',CSSSchema);
module.exports=CSSdb;