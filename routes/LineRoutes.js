const express=require('express');
const Line=require('../models/lineModel');
const Machine=require('../models/machineModel');

const router=express.Router();

router.post('/addLine', (req,res)=>{
    const newLine= new Line({
        name:req.body.lineName,
    });

    newLine.save().then((result)=>{res.send(result);}).catch((err)=>{console.log(err);
    res.send(500,error);
    });
});


router.post('/addMachine', (req,res)=>{
    const newMachine= new Machine({
        name:req.body.machineName,
        code:req.body.machineCode,
    });

    //var MachineList=[];
    newMachine.save().then((result)=>{
        res.send(result);
         Line.findByIdAndUpdate(req.body.lineId, {
            "$push": { "machine": result._id } 
            },{ "new": true, "upsert": true }, function(err,doc){
              if(err) {
                  res.send(500,err);}
              console.log("machine added");
              console.log(doc);
            });
    
    }) 
});





router.get('/getAllLines', async(req,res)=>{
    
    Line.find()
          .populate('machine').sort({name:1}).exec(function(err,line){
            if (err) return handleError(err);
            res.send(line);
            });
            
        });

        // const cursor = Line.find().populate('machine').lean(true).cursor();
        // // cursor.next(function(error, doc) {
            
        // //     res.send(doc);
        // //   });
        // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        //     res.send(doc); // Prints documents one at a time
        // }


    // });
module.exports = router;
