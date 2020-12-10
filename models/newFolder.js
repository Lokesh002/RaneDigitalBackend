const mongoose=require('mongoose');

const newFolderSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    }
  },{timestamps:true});

 const FolderDB=mongoose.model('folders',newFolderSchema);
module.exports=FolderDB;