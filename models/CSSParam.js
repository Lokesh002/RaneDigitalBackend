const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const CSSParamSchema=mongoose.Schema({
paramName:{
    type:String,
    required:true
},
CSS:{type:mongoose.Schema.Types.ObjectId, ref: 'CSS'},

machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},
revisionNo:{
    type:Number,
    required:true
},
revisionDesc:{
    type:String,
    required:true
},
revisionDoneBy:{
    type:String,
    required:true
},
revisionDate:{
    type:Date,
    required:true
},
frequency:{
    type:String,
    required:true
},
spec:{
    type:String,
    required:true
},
inputType:{
    type:String,
    required:true
},


},{timestamps:true});
 const cssParamdb=mongoose.model('CSSParams',CSSParamSchema);
module.exports=cssParamdb;