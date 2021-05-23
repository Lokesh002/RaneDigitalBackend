const express=require('express');
const FTA=require('../models/FTAModel');
const router=express.Router();
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const e = require('express');

const multer = require('multer');
  const bodyParser = require('body-parser');

const path =require('path');
var finalURL='http://192.168.43.18:3000/';
//Generate QPCR
var ftaPhoto="";


const ftaStorage=multer.diskStorage({
  destination: './public/FTApics/',
  filename:async function(req,file,cb){
    ftaPhoto=file.fieldname+"_"+Date.now()+path.extname(file.originalname);
     await cb(null,ftaPhoto);
     
  }
  });
 
      const uploadQpcrOKPhoto=multer({
      
        storage:ftaStorage,
        
      limits:{
          fileSize: 10* 1024 * 1024
      }
      }).single('myFTApic');
     
      router.post('/uploadFTApic',(req,res)=>{
        
        uploadQpcrOKPhoto(req,res,(err) =>{
          // console.log(req.body.pfuId);
        
            if(err){
                res.send(err);
  
            }
            else{
              
                //console.log(req.file);
                FTA.findByIdAndUpdate(req.body.id,{
                  photoURL:finalURL+'FTApics/'+ftaPhoto
                  },{ "new": true, "upsert": true }, function(err,doc){
                    if(err) 
                    {
                      res.status(500).send("Error!");
                      console.log(err);
                  }
                    res.send(doc);
                    
                  }).populate('raisingPerson','username genId department').populate('line','name').populate('machine','name code').populate('parent','description');
                      } 
                });
               
                
     }); 
         
  
router.post('/generate', (req,res)=>{


    var ancestors=[];
    FTA.findById(req.body.parent).select("ancestors").then((ftaParent)=>{
        if(ftaParent!=null)
        {
             ancestors=ftaParent["ancestors"]
        ancestors.push(req.body.parent);
        }
       
        const fta=new FTA({
            description:req.body.description,
    
            
            photoURL:req.body.photoURL,
            parent:req.body.parent,
            raisingPerson: req.body.raisingPerson,
            ancestors:ancestors,
            
            machine:req.body.machine,
            
            line:req.body.line,
            
            
            
          });
          fta.save().then((result)=>{result.populate('raisingPerson','username genId department').populate('machine','name code').populate('parent','description').populate('line',function(err, fta) {
            if(err) throw err;
      
            
            
              res.send(fta);
          });}).catch((err)=>{
            res.status(404).send("Error");
            console.log(err);
          }); 
      });
    }); 
      router.post('/deleteFTA', (req,res)=>{
 
        var id=req.body.id;
     
        FTA.find({"ancestors":id}).select('ancestors').then((ChildFtas)=>{
            for(var i=0;i<ChildFtas.length;i++)
            {
                FTA.findByIdAndDelete(ChildFtas[i]['_id'],(err,result)=>{
                    if(err) 
                    
                    {console.log(err);
                    res.status(404).send("Error Occured");
                        return;
                    
                    }
                    else{
                      
                          var photo=result['photoURL'].toString();
                        
                       if(fs.existsSync('./public/FTApics/'+photo.substring(34,59)))
                       {
                         fs.unlinkSync('./public/FTApics/'+photo.substring(34,59));
                       }
                        console.log(photo +" deleted!!!");
                    }
                });
            }
            FTA.findByIdAndDelete(id,(err,result)=>{
                if(err) 
                
                {console.log(err);
                res.status(404).send("Error Occured");
                    return;
                
                }
                else{
                  
                      var photo=result['photoURL'].toString();
                    
                   if(fs.existsSync('./public/FTApics/'+photo.substring(34,59)))
                   {
                     fs.unlinkSync('./public/FTApics/'+photo.substring(34,59));
                   }
                   console.log(photo +" deleted!!!");
                }
                
            res.status(200).send({"msg":"Successfully Deleted"});
        });
        
        
    });
      });
      router.post('/edit', (req,res)=>{
          
        var description=req.body.description;
        var photoURL=req.body.photoURL;
        var id=req.body.id;
    
    
        
            FTA.findByIdAndUpdate(id,{
                "description":description,"photoURL":photoURL
            }).populate('raisingPerson','username genId department').populate('line','name').populate('machine','name code').populate('parent','description').then((fta)=>{
            res.send(fta)}).catch((err)=>{res.status(404).send("Error")});
        
    
   
    
  });
  
  router.post('/getFTA', (req,res)=>{
      
    var parent=req.body.parent;
    var machine=req.body.machine;

    if(parent==null)
    {
        FTA.find({
            "parent":parent,"machine":machine
        }).populate('raisingPerson','username genId department').populate('line','name').populate('machine','name code').populate('parent','description').then((pfu)=>{
      
        res.send(pfu)}).catch((err)=>{res.status(404).send("  ")});
            
    }
    else{
        FTA.find({
            "parent":parent,"machine":machine
        }).populate('raisingPerson','username genId department').populate('line','name').populate('machine','name code').populate('parent','description').then((pfu)=>{
      
        res.send(pfu)}).catch((err)=>{res.status(404).send("  ")});
        
    }
  });

  module.exports = router;