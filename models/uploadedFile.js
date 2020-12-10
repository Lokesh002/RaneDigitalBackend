const mongoose=require('mongoose');
//const folderSchema=require('./newFolder');

  
const FileSchema=mongoose.Schema({
name:{
    type:String,
    required:true
},
originalName:{
    type:String,
    required:true
},
url:{
    type:String,
    required:true,
},
department:{
    type:String,
    required:true,
},
folder:{type:mongoose.Schema.Types.ObjectId, ref: 'folders'},
size:{
    type:Number,
    required:true,
}

},{timestamps:true});
 const FileDB=mongoose.model('Files',FileSchema);
module.exports=FileDB;