const mongoose=require('mongoose');
//const machineSchema=require('./machineModel');

  
const UserSchema=mongoose.Schema({
    username:{
    type:String,
    required:true
},
genId:{ type:String,
    required:true
},
password:{
    type:String,
    required:true
},
department:{
    type:String,
    required:true
},


accountType:{
    type:String,
    required:true
},

access:{
    
    pfu:Boolean,
cssEdit:Boolean,
cssView:Boolean,
cssVerify:Boolean,
qssVerify:Boolean,
qssEdit:Boolean,
qssView:Boolean,
qssAdd:Boolean,
cssAdd:Boolean,
addNewUser:Boolean
 
},


},{timestamps:true});
 const UserDB=mongoose.model('Users',UserSchema);
module.exports=UserDB;