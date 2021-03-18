const express=require('express');
const router=express.Router();
const shift=require('../models/ShiftModel');
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const mongoose = require("mongoose");
const dateTime=require('date-and-time');




function getTime( dt)
{   
    var hour= Number(dt.substring(0,2));
    var min = Number(dt.substring(3,5));
    var sec = Number(dt.substring(6,8));
    
    console.log(hour);
    console.log(min);
    console.log(sec);
    var diff;
    console.log(new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCHours());
    if(hour<new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCHours())
    {
        console.log("do it next day");
        var d1=new Date(Date.now()+(5*60*60*1000+30*60*1000));
        var temp1Date=dateTime.addDays(d1,1);
        var tmp1Dt=new Date(temp1Date.getFullYear(),temp1Date.getMonth(), temp1Date.getDate(), hour+5, min+30, sec );
        console.log(tmp1Dt);
        diff=dateTime.subtract(tmp1Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
        console.log(diff);
        setTimeout(setToToday, diff, new Date(Date.now()+(5*60*60*1000+30*60*1000)));
    }
    else if(hour==new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCHours())
    {
        if(min<new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCMinutes())
        {
            console.log("do it next day");
            var d2=new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
            var temp2Date=dateTime.addDays(d2,1);
            var tmp2Dt=new Date(temp2Date.getFullYear(),temp2Date.getMonth(), temp2Date.getDate(), hour+5, min+30, sec );
            console.log(tmp2Dt);
            diff=dateTime.subtract(tmp2Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
            console.log(diff);
            setTimeout(setToToday, diff, new Date(Date.now()+(5*60*60*1000+30*60*1000)));
        }
        else if(min==new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCMinutes())
        {
            if(sec<new Date(Date.now()+(5*60*60*1000+30*60*1000)).getUTCSeconds())
            {
                console.log("do it next day");
                var d3=new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
                var temp3Date=dateTime.addDays(d3,1);
                var tmp3Dt=new Date(temp3Date.getFullYear(),temp3Date.getMonth(), temp3Date.getDate(), hour+5, min+30, sec );
                console.log(tmp3Dt);
                diff=dateTime.subtract(tmp3Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
                console.log(diff);
                setTimeout(setToToday, diff, new Date(Date.now()+(5*60*60*1000+30*60*1000)));
            }
            else 
            {
                console.log("do today");
                var temp4Date=new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
                var tmp4Dt=new Date(temp4Date.getFullYear(),temp4Date.getMonth(), temp4Date.getDate(), hour+5, min+30, sec );
                console.log(tmp4Dt);
                diff=dateTime.subtract(tmp4Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
                console.log(diff);
                setTimeout(setToToday, diff, new Date(Date.now()+(5*60*60*1000+30*60*1000)));
            }
        }
        else
        {
            console.log("do today");
            var temp5Date=new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
            var tmp5Dt=new Date(temp5Date.getFullYear(),temp5Date.getMonth(), temp5Date.getDate(), hour+5, min+30, sec );
            console.log(tmp5Dt.toUTCString());
            diff=dateTime.subtract(tmp5Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
            console.log(diff);
            setTimeout(setToToday, diff, new Date(Date.now()+(5*60*60*1000+30*60*1000)));
        }
    }
    else
    {
        console.log("do today");
        var temp6Date=new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
        var tmp6Dt=new Date(temp6Date.getFullYear(),temp6Date.getMonth(), temp6Date.getDate(), hour+5, min+30, sec );
        console.log(tmp6Dt.getUTCDate);
        diff=dateTime.subtract(tmp6Dt, new Date(Date.now()+(5*60*60*1000+30*60*1000))).toMilliseconds();
        console.log(diff);
        
        setTimeout(setToToday, diff, new Date(Date.now()));
    }
}
function setToToday(arg) {
    console.log(`arg was => ${arg}`);
    shift.findById(1,(err,plan)=>{
        if(err)
    {
        console.log(err);

    }
    else{
        var newPlan={todayAshift:plan["tommorrowAShift"], todayBshift:plan["tommorrowBShift"],todayCshift:plan["tommorrowCShift"]};
        
        shift.findByIdAndUpdate(1,{$set: {'todayAShift.from':  newPlan['todayAshift']['from'],
        'todayAShift.to': newPlan['todayAshift']['to'],
        'todayAShift.hours':  newPlan['todayAshift']['hours'],
        'todayBShift.from': newPlan['todayBshift']['from'],
        'todayBShift.to':  newPlan['todayBshift']['to'],
        'todayBShift.hours': newPlan['todayBshift']['hours'],
        'todayCShift.from': newPlan['todayCshift']['from'],
        'todayCShift.to':  newPlan['todayCshift']['to'],
        'todayCShift.hours':  newPlan['todayCshift']['hours'],
        'sameAsToday':true}},{ "new": true, "upsert": true }, function(err,doc){
              if(err) 
              {
                res.status(500).send("Error!");
                console.log(err);
            }
              console.log('Shift Changed');

              
            });
    
    }
    })
}
console.log('helo');
//console.log(Date.now().toString());
//console.log( new Date('August 19, 1975 23:15:30 GMT+05:30').getTimezoneOffset());
//console.log(new Date(new Date(Date.now()+(5*60*60*1000+30*60*1000))));
 //get shift details and start timer
 var x;

 function startTimer()
 {

    shift.findById(1,(err,plan)=>{
        if(err)
        {
        console.log(err);
        
        }
        else{
        
            x=plan["sameAsToday"];
            if(!x)
            { console.log(new Date(Date.now()+(5*60*60*1000+30*60*1000)));
                console.log("time change process started");
                getTime(plan["tommorrowAShift"]["from"],new Date(Date.now()+(5*60*60*1000+30*60*1000)));
            }
            
        }
         });
 }
 

 startTimer();


 //API for getting plan
router.get('/getPlan',(req,res)=>{
    mongoose.connection.db.listCollections({name: 'shifts'})
    .next(function(err, collinfo) {
        if (collinfo) {
            // The collection exists
            shift.findById(1,((err,plan)=>{
                if(err)
                {    
                   console.log(err);
                }
                else{
                    if(plan!=null)
                    res.send(plan);
                    else
                    {
                        const plan1=new shift({
                
                            _id:1,
                            todayAShift:{
                                from:'06:00:00'
                                ,to: '14:30:00'
            ,hours: 8.5
                            },
                            todayBShift:{
                                from:'14:30:00'
                                ,to: '23:00:00'
            ,hours: 8.5
                            },
                            todayCShift:{
                                from:'23:00:00'
                                ,to: '06:00:00'
            ,hours: 7
                            },
                            tommorrowAShift:{
                                from:'06:00:00'
                                ,to: '14:30:00'
            ,hours: 8.5
                            },
                            tommorrowBShift:{
                               from:'14:30:00'
                                ,to: '23:00:00'
            ,hours: 8.5
                            },
                            tommorrowCShift:{
                                from:'23:00:00'
                                ,to: '06:00:00'
            ,hours: 7
                            },
                            sameAsToday:true
            
                        });
                        plan1.save().then((result)=>{res.send(result);}).catch((err)=>{
                          res.status(404).send("Error");
                          console.log(err);
                        }); 
                    }
                    
                    
                }
                
            }));
        }
        else{

            const plan1=new shift({
                
                _id:1,
                todayAShift:{
                    from:'06:00:00'
                    ,to: '14:30:00'
,hours: 8.5
                },
                todayBShift:{
                    from:'14:30:00'
                    ,to: '23:00:00'
,hours: 8.5
                },
                todayCShift:{
                    from:'23:00:00'
                    ,to: '06:00:00'
,hours: 7
                },
                tommorrowAShift:{
                    from:'06:00:00'
                    ,to: '14:30:00'
,hours: 8.5
                },
                tommorrowBShift:{
                   from:'14:30:00'
                    ,to: '23:00:00'
,hours: 8.5
                },
                tommorrowCShift:{
                    from:'23:00:00'
                    ,to: '06:00:00'
,hours: 7
                },
                sameAsToday:true

            });
            plan1.save().then((result)=>{res.send(result);}).catch((err)=>{
              res.status(404).send("Error");
              console.log(err);
            }); 
        }
    });
    
});


router.post("/setPlan",((req,res)=>{
    var tommorrowAShiftFrom=req.body.tommorrowAShiftFrom;
    var tommorrowAShiftTo=req.body.tommorrowAShiftTo;   
    var tommorrowAShifthours=req.body.tommorrowAShifthours; 
    var tommorrowBShiftFrom=req.body.tommorrowBShiftFrom;
    var tommorrowBShiftTo=req.body.tommorrowBShiftTo;
    var tommorrowBShifthours=req.body.tommorrowBShifthours; 
    var tommorrowCShiftFrom=req.body.tommorrowCShiftFrom;
    var tommorrowCShiftTo=req.body.tommorrowCShiftTo;
    var tommorrowCShifthours=req.body.tommorrowCShifthours; 
    

    shift.findByIdAndUpdate(1,{$set: {'tommorrowAShift.from': tommorrowAShiftFrom,
    'tommorrowAShift.to': tommorrowAShiftTo,
    'tommorrowAShift.hours': tommorrowAShifthours,
    'tommorrowBShift.from': tommorrowBShiftFrom,
    'tommorrowBShift.to': tommorrowBShiftTo,
    'tommorrowBShift.hours': tommorrowBShifthours,
    'tommorrowCShift.from': tommorrowCShiftFrom,
    'tommorrowCShift.to': tommorrowCShiftTo,
    'tommorrowCShift.hours': tommorrowCShifthours,
    'sameAsToday':false}}
       
        
       ,{ "new": true, "upsert": true }, function(err,doc){
          if(err) 
          {
            res.status(500).send("Error!");
            console.log(err);
        }
          res.send('Shift Changed');
          
          startTimer();
          
        });
}));




module.exports = router;