const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const FourMSchema=mongoose.Schema({

problem:{
    type:String,
    required:true
},
partName:{
    type:String,
    required:true
},
NatureOfChange: {
    type:String,
    required:true
},
raisingPerson: {type:mongoose.Schema.Types.ObjectId, ref: 'Users'},
status:{
    type:Number,
    required:true
},
beforeChange:{
    type:String,
    
},
afterChange:{
    type:String,
    
},
firstSerialNumber:{
    type:String,
    required:true
},
lastSerialNumber:{
    type:String, 
},
totalQty:{
    type:Number,
    required:true
},
PCRSheetNumber:
{
    type:String,
    required:true
},
action:{
    type:String,
    required:true,
},
photoURL:{
    type:String,
    
},
machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},

line:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'},
ConfirmingDept:{
    type:String,
},
result:{
    type:String,
}

},{timestamps:true});
 const FourMdb=mongoose.model('4M',FourMSchema);
module.exports=FourMdb;