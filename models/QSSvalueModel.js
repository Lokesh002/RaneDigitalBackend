const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

const QSSValueSchema=mongoose.Schema({
    value:{
    type:String,
    required:true
},

machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},


param:{type:mongoose.Schema.Types.ObjectId, ref: 'QSSParams'},
shift:{
    type:String,
    required:true
},
filledBy:
    {type:mongoose.Schema.Types.ObjectId, ref: 'Users'}

},{timestamps:true});
const QSSValueDB=mongoose.model('QSSValues',QSSValueSchema);
module.exports=QSSValueDB;