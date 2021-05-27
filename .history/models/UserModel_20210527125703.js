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
acs:{
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
addNewUser:Boolean,
ftaEdit:Boolean,
ftaAdd:Boolean,
ftaDelete:Boolean,
ftaSee:Boolean,
accessDept:[String]
},


},{timestamps:true});
 const UserDB=mongoose.model('Users',UserSchema);
module.exports=UserDB;