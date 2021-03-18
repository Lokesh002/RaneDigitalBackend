const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const QSSSchema=mongoose.Schema({
revision:{
    type:Number,
    required:true
},
line:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'},

machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'}


},{timestamps:true});
 const QSSdb=mongoose.model('QSS',QSSSchema);
module.exports=QSSdb;