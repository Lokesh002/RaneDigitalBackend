const mongoose=require('mongoose');

const machineSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    }
  },{timestamps:true});

 const machineDB=mongoose.model('Machines',machineSchema);
module.exports=machineDB;