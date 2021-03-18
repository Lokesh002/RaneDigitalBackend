const express=require('express');
const router=express.Router();
const Shift=require('../models/ShiftModel');
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');

router.post('/', (req,res)=>{
    const pfu=new PFU({
          problem: req.body.problem.toString(),
          description:req.body.description.toString(),
          raisingDept: req.body.raisingDepartment.toString(),
          deptResponsible: req.body.departmentResponsible.toString(),
          status:0,
          rootCause:"",
          targetDate:undefined,
          action:"",
          raisingDate:Date.now(),
          actualClosingDate:undefined,
          machine: req.body.machine,
          line:req.body.line,
          raisingPerson:req.body.raisingPerson,
          photoURL:""
      });
      pfu.save().then((result)=>{result.populate('machine').populate('raisingPerson',function(err, pfu) {
        if(err) throw err;
  
        
        
          res.send(pfu);
      });}).catch((err)=>{
        res.status(404).send("Error");
        console.log(err);
      }); 
  });
  


module.exports = router;