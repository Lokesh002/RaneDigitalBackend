const express=require('express');
const FTA=require('../models/FTAModel');
const router=express.Router();
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const e = require('express');


router.post('/generate', (req,res)=>{
    const fta=new FTA({
        description:req.body.description,

        
        photoURL:req.body.photoURL,
        parent:req.body.parent,
        raisingPerson: req.body.raisingPerson,
        
        
        machine:req.body.machine,
        
        line:req.body.line,
        
        
        
      });
      fta.save().then((result)=>{result.populate('machine').populate('line').populate('parent','description').populate('raisingPerson',function(err, fta) {
        if(err) throw err;
  
        
        
          res.send(fta);
      });}).catch((err)=>{
        res.status(404).send("Error");
        console.log(err);
      }); 
  });
  
  router.post('/edit', (req,res)=>{
      
    var description=req.body.description;
    var photoURL=req.body.photoURL;
    var id=req.body.id;


    
        FTA.findByIdAndUpdate(id,{
            "description":description,"photoURL":photoURL
        }).populate('raisingPerson','username genId department').populate('line','name').populate('machine','name code').populate('parent','description').then((fta)=>{
        res.send(fta)}).catch((err)=>{res.status(404).send("")});
    
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