const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const CSSValueSchema=mongoose.Schema({
    value:{
    type:String,
    required:true
},

machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},


param:{type:mongoose.Schema.Types.ObjectId, ref: 'CSSParams'},
shift:{
    type:String,
    required:true
},
filledBy:
    {type:mongoose.Schema.Types.ObjectId, ref: 'Users'}

},{timestamps:true});
 const CSSValueDB=mongoose.model('CSSValues',CSSValueSchema);
module.exports=CSSValueDB;