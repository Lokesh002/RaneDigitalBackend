const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const QPCRSchema=mongoose.Schema({

problem:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
raisingDept: {
    type:String,
    required:true
},
raisingPerson: {type:mongoose.Schema.Types.ObjectId, ref: 'Users'},
targetDate:{
    type:Date,
    
},
status:{
    type:Number,
    required:true
},
rootCause:{
    type:String,
    
},
deptResponsible:{
    type:String,
    
},
raisingDate:{
    type:Date,
    required:true
},
actualClosingDate:{
    type:Date,
    
},
photoURL:{
    type:String,
    
},
impactProd:{
    type:Boolean,
    
},
impactQual:{
    type:Boolean,
    
},
impactCost:{
    type:Boolean,
    
},
impactDisp:{
    type:Boolean,
    
},
impactSafe:{
    type:Boolean,
    
},
impactMora:{
    type:Boolean,
    
},
impactEnvi:{
    type:Boolean,
    
},
closingRemarks:{
    type:String,
    
},
acceptingPerson:{
    type:String,
    
},
rejectingReason:{
    type:String,
    
},
machine:{type:mongoose.Schema.Types.ObjectId, ref: 'Machines'},

line:{type:mongoose.Schema.Types.ObjectId, ref: 'Lines'},
action:{
    type:String,
    
}


},{timestamps:true});
 const QPCRdb=mongoose.model('QPCR',QPCRSchema);
module.exports=QPCRdb;