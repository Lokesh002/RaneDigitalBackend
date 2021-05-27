const express=require('express');
const router=express.Router();
const shift=require('../models/ShiftModel');
const fs=require('fs');
const ExcelJS = require('exceljs');
const { userInfo } = require('os');
const fse=require('fs-extra');
const mongoose = require("mongoose");
const dateTime=require('date-and-time');
const { trim, now } = require('jquery');
const { time } = require('console');

const path =require('path');



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
//console.log('helo');
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
 

 //startTimer();


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
    

    shift.findByIdAndUpdate(1,{$set: {
        'tommorrowAShift.from': tommorrowAShiftFrom,
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



function daysInMonth ( month, year) {  
    return new Date(year, month+1, 0).getDate();
}


// ***** setting the data entry to excel files *******
router.post("/dataEntry",((req,res)=>{
const OKprod=req.body.OKproduction;
const NGprod=req.body.NGproduction;
const breakdownTime=req.body.breakdownTime;
const otherLoss=req.body.otherLoss;
const retryNo=req.body.retryNo;
const remarks=req.body.remarks;
const line=req.body.line;

var dataPresent=false;

var sheetNames=['OK Production','NG Production','Breakdown Time','Other Losses', 'Retry Numbers', 'Remarks'];
  var worksheets=new Map();
  var shiftString;
shift.findById(1,((err,plan)=>{
    if(err)
    {    
       console.log(err);
    }
    else{
        try{
            
            
            var date=new Date(Date.now()+(5*60*60*1000+30*60*1000));
            var Path='./public/shiftData/'+date.getFullYear().toString();
 
            if(!fs.existsSync(Path))  
            {
                fs.mkdirSync(Path);
            }
            var subPath=Path+'/'+(date.getMonth()+1).toString();
            if(!fs.existsSync(subPath))  
            {
                fs.mkdirSync(subPath);
            }
            var filePath=subPath+'/'+line+'.xlsx';
 //  //Workbook code start
 //  //mandatory
   
            if(!fs.existsSync(filePath))
  {
    var workbook = new ExcelJS.Workbook();
  workbook.creator ="Lokesh Joshi"; 
  sheetNames.forEach(element => {
      worksheets.set(element,workbook.addWorksheet(element));

      worksheets.get(element).columns=[
         {header:'Date',key:'date',width:20},
        {header:'Shift',key:'shift',width:10}, 
        {header:'00:00 to 01:00',key:'firstHour',width:15}, 
        {header:'01:00 to 02:00',key:'secondHour',width:15},
        {header:'02:00 to 03:00',key:'thirdHour',width:15},
        {header:'03:00 to 04:00',key:'fourthHour',width:15},
        {header:'04:00 to 05:00',key:'fifthHour',width:15},
        {header:'05:00 to 06:00',key:'sixthHour',width:15},
        {header:'06:00 to 07:00',key:'seventhHour',width:15},
        {header:'07:00 to 08:00',key:'eigthHour',width:15},
        {header:'08:00 to 09:00',key:'ninthHour',width:15},
        {header:'09:00 to 10:00',key:'tenthHour',width:15},
        {header:'10:00 to 11:00',key:'eleventhHour',width:15},
        {header:'11:00 to 12:00',key:'twelfthHour',width:15},
        {header:'12:00 to 13:00',key:'thriteenthHour',width:15},
        {header:'13:00 to 14:00',key:'fourteenthHour',width:15},
        {header:'14:00 to 15:00',key:'fifteenthHour',width:15},
        {header:'15:00 to 16:00',key:'sixteenthHour',width:15},
        {header:'16:00 to 17:00',key:'seventeenthHour',width:15},
        {header:'17:00 to 18:00',key:'eighteenthHour',width:15},
        {header:'18:00 to 19:00',key:'nineteenthHour',width:15},
        {header:'19:00 to 20:00',key:'twentiethHour',width:15},
        {header:'20:00 to 21:00',key:'twentyfirstHour',width:15},
        {header:'21:00 to 22:00',key:'twentysecondHour',width:15},
        {header:'22:00 to 23:00',key:'twentythirdHour',width:15},
        {header:'23:00 to 00:00',key:'twentyfourthHour',width:15},
   
      ];
      for(var i=1;i<=daysInMonth(date.getMonth(), date.getFullYear());i++){
       
     worksheets.get(element).addRow([new Date(date.getFullYear(), date.getMonth(),i,5,30,0,0),'A']);
     worksheets.get(element).addRow([new Date(date.getFullYear(), date.getMonth(),i,5,30,0,0),'B']);
     worksheets.get(element).addRow([new Date(date.getFullYear(), date.getMonth(),i,5,30,0,0),'C']);
   
      }
    
    });

function getColumnNumber(dateCheck){
var hour=dateCheck.getUTCHours();
return hour+3;

}


function getRowNumber(nowShift,dateCheck)
{
    console.log(dateCheck);
    console.log(dateCheck.getUTCDate()*3);
    var rowNumber=(dateCheck.getUTCDate()*3)+1;
    console.log('earlier row No'+rowNumber.toString());
    if(nowShift=='A')
    {
        rowNumber=rowNumber-2;

    }
    else if(nowShift=='B')
    {
        rowNumber=rowNumber-1;
    }

    return rowNumber;
}


    function getCellNumber(element,valueToAdd)
    {
        const worksheet=worksheets.get(element);
        var nowShift=getShift(date);
        var rowNumber=getRowNumber(nowShift, date);
        
        
        
        console.log('Row Number is'+rowNumber.toString());
        var row = worksheet.getRow(rowNumber);
        
               if(nowShift!=getShift(new Date(date-(60*60*1000))))
               {
                   if(nowShift!=getShift(new Date(date-(30*60*1000))))
                   {
                       if(plan['today'+nowShift+'Shift']['from'].substring(3,5)!='00')
                       {
                           console.log('shift11');
                           row=worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
                       
                           if(row.getCell(getColumnNumber(date)).value==null)
                           {
                               row.getCell(getColumnNumber(date)).value=valueToAdd;
                         
                           }
                           else{
                               dataPresent=true;
                           }
                          
                       }
                       else{
                           console.log('shift12');
                          row= worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
                     
                          if(row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value==null)
                          {row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value=valueToAdd;}
                          else{
                              dataPresent=true;
                          }
              
                       }
                   }
                   else{
                           console.log('shift21');
                           
                           
                           row= worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
                           
                   
                           
                           if(row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value==null)
                           {
                               row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value=valueToAdd;
                           }
                           else{
                               dataPresent=true;
                           }
                        
                   }
               
               }
               else{
                   console.log('shift22');
                   console.log(new Date(date-(60*60*1000)));
                  row= worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
                  if(row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value==null)
                  {row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value=valueToAdd;}
                  else{
                      dataPresent=true;
                  }
                           
                         
                           console.log(valueToAdd);
               }
               
    }
    function inMiddleof(a,b,datecheck){
    if(dateTime.subtract(datecheck,a).toMilliseconds()>0)
        {
            if( dateTime.subtract(datecheck,b).toMilliseconds()<0){
                return true;
            
            }
        }
       return false;
    }
    function getShift(datecheck){
        var Afrom=new Date(datecheck.getUTCFullYear(),datecheck.getUTCMonth(), datecheck.getUTCDate(), Number(plan['todayAShift']['from'].substring(0,2))+5,Number(plan['todayAShift']['from'].substring(3,5))+30,Number(plan['todayAShift']['from'].substring(6,8)),0);
       
       
       var Ato=dateTime.addHours(Afrom,(plan['todayAShift']['hours'])); 
       var Bfrom=new Date(Ato.getUTCFullYear(),Ato.getUTCMonth(), Ato.getUTCDate(), Number(plan['todayBShift']['from'].substring(0,2))+5,Number(plan['todayBShift']['from'].substring(3,5))+30,Number(plan['todayBShift']['from'].substring(6,8)));
       var Bto=dateTime.addHours(Bfrom,(plan['todayBShift']['hours'])); 
       
       
        var Cfrom=new Date(Bto.getUTCFullYear(),Bto.getUTCMonth(), Bto.getUTCDate(), Number(plan['todayCShift']['from'].substring(0,2))+5,Number(plan['todayCShift']['from'].substring(3,5))+30,Number(plan['todayCShift']['from'].substring(6,8)));
        var Cto=dateTime.addHours(Cfrom,(plan['todayCShift']['hours'])); 
       


        return inMiddleof(Afrom,Ato,datecheck)?'A':inMiddleof(Bfrom,Bto,datecheck)?'B':'C';
        
    }
    
    

    

    getCellNumber('OK Production',OKprod);

    getCellNumber('NG Production',NGprod);
    
    getCellNumber('Breakdown Time',breakdownTime);
    getCellNumber('Other Losses',otherLoss);
    getCellNumber('Retry Numbers',retryNo);
    getCellNumber('Remarks',remarks);
    
    if(dataPresent==false)
    {
    workbook.xlsx.writeFile(filePath).then((data)=>{}).catch((err)=>{console.log(err);});
    }
    if(dataPresent)
    {
        res.send('Data Already Present');
    }
    else{
        res.send('Data Added');
    }
    }
  else{
    var workbook =new ExcelJS.Workbook();
  
  workbook.xlsx.readFile(filePath).then(function() {

sheetNames.forEach(element => {
    worksheets.set(element,workbook.getWorksheet(element)); 
});
function getColumnNumber(dateCheck){
    var hour=dateCheck.getUTCHours();

    return hour+3;
    
    }
    
    function getRowNumber(nowShift,dateCheck)
    {var rowNumber=(dateCheck.getUTCDate()*3)+1;
        if(nowShift=='A')
        {
            rowNumber=rowNumber-2;
    
        }
        else if(nowShift=='B')
        {
            rowNumber=rowNumber-1;
        }
    
        return rowNumber;
    }
    
    
        function getCellNumber(element,valueToAdd)
        {
            const worksheet=worksheets.get(element);
            var nowShift=getShift(date);
            var rowNumber=getRowNumber(nowShift, date);
            
            
            
            var row = worksheet.getRow(rowNumber);
            
if(nowShift!=getShift(new Date(date-(60*60*1000))))
{
    if(nowShift!=getShift(new Date(date-(30*60*1000))))
    {
        if(plan['today'+nowShift+'Shift']['from'].substring(3,5)!='00')
        {
            console.log('shift11');
            row=worksheet.getRow(getRowNumber(getShift(new Date(date-(30*60*1000))),new Date(date-(30*60*1000))));
             console.log('row '+getRowNumber(getShift(new Date(date-(30*60*1000))),new Date(date-(30*60*1000))).toString());
             console.log('shift '+getShift(new Date(date-(30*60*1000))).toString());
             console.log('column '+getColumnNumber(date));
            if(row.getCell(getColumnNumber(date)).value==null)
            {
                row.getCell(getColumnNumber(date)).value=valueToAdd;
          
            }
            else{
                dataPresent=true;
            }
           
        }
        else{
            console.log('shift12');
           row= worksheet.getRow(getRowNumber(getShift(new Date(date-(30*60*1000))),new Date(date-(30*60*1000))));
 
           if(row.getCell(getColumnNumber(new Date(date-(30*60*1000)))).value==null)
           {row.getCell(getColumnNumber(new Date(date-(30*60*1000)))).value=valueToAdd;}
           else{
               dataPresent=true;
           }
           
        }
    }
    else{

        if(plan['today'+nowShift+'Shift']['from'].substring(3,5)!='00')
        {
            console.log('shift211');
            
            row= worksheet.getRow(getRowNumber(getShift(new Date(date-(30*60*1000))),new Date(date-(30*60*1000))));
            
             console.log('row '+getRowNumber(getShift(new Date(date-(30*60*1000))),new Date(date-(30*60*1000))).toString());
        
            
            if(row.getCell(getColumnNumber(new Date(date-(30*60*1000)))).value==null)
            {
                row.getCell(getColumnNumber(new Date(date-(30*60*1000)))).value=valueToAdd;
            }
            else{
                dataPresent=true;
            }
        }
        else{
            console.log('shift212');
            
            row= worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
            
             console.log('row '+getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))).toString());
           
            
            if(row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value==null)
            {
                row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value=valueToAdd;
            }
            else{
                dataPresent=true;
            }
        }
            
          
    }

}
else{
    console.log('shift22');
   console.log('row'+getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))).toString());
   row= worksheet.getRow(getRowNumber(getShift(new Date(date-(60*60*1000))),new Date(date-(60*60*1000))));
   if(row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value==null)
   {row.getCell(getColumnNumber(new Date(date-(60*60*1000)))).value=valueToAdd;}
   else{
       dataPresent=true;
   }
           
          
            console.log(valueToAdd);
}}
        function inMiddleof(a,b,datecheck){
        if(dateTime.subtract(datecheck,a).toMilliseconds()>0)
            {
                if( dateTime.subtract(datecheck,b).toMilliseconds()<0){
                    return true;
                
                }
            }
           return false;
        }
        function getShift(datecheck){
            var Afrom=new Date(datecheck.getUTCFullYear(),datecheck.getUTCMonth(), datecheck.getUTCDate(), Number(plan['todayAShift']['from'].substring(0,2))+5,Number(plan['todayAShift']['from'].substring(3,5))+30,Number(plan['todayAShift']['from'].substring(6,8)),0);
           
           
           var Ato=dateTime.addHours(Afrom,(plan['todayAShift']['hours'])); 
           var Bfrom=new Date(Ato.getUTCFullYear(),Ato.getUTCMonth(), Ato.getUTCDate(), Number(plan['todayBShift']['from'].substring(0,2))+5,Number(plan['todayBShift']['from'].substring(3,5))+30,Number(plan['todayBShift']['from'].substring(6,8)));
           var Bto=dateTime.addHours(Bfrom,(plan['todayBShift']['hours'])); 
           
           
            var Cfrom=new Date(Bto.getUTCFullYear(),Bto.getUTCMonth(), Bto.getUTCDate(), Number(plan['todayCShift']['from'].substring(0,2))+5,Number(plan['todayCShift']['from'].substring(3,5))+30,Number(plan['todayCShift']['from'].substring(6,8)));
            var Cto=dateTime.addHours(Cfrom,(plan['todayCShift']['hours'])); 
           
        
            return inMiddleof(Afrom,Ato,datecheck)?'A':inMiddleof(Bfrom,Bto,datecheck)?'B':'C';
            
        }
        
    
        
    
        getCellNumber('OK Production',OKprod);
    
        getCellNumber('NG Production',NGprod);
        
        getCellNumber('Breakdown Time',breakdownTime);
        getCellNumber('Other Losses',otherLoss);
        getCellNumber('Retry Numbers',retryNo);
        getCellNumber('Remarks',remarks);
        
        if(dataPresent==false)
        {
        workbook.xlsx.writeFile(filePath).then((data)=>{}).catch((err)=>{console.log(err);});
        }
        if(dataPresent)
        {
            dataPresent=false;
            res.send('Data Already Present');
        }
        else{
            dataPresent=false;
            res.send('Data Added');
        }



 }).catch((err)=>{
  console.log(err);
 });
   
    
}

  
  
}
catch(err){
   console.log(err);
           }
        }
    }));
    
    
    
}));

router.get('/getEntryTime',(req,res)=>{
    const srcDir = './public/shiftData';
    var years=[];

    
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
    //    .map(file => path.join(srcpath,file))
    //    .filter(path => fs.statSync(path).isDirectory());
  }
  function getFiles(srcpath) {
    return fs.readdirSync(srcpath);
    //  .map(file => file)
      //.filter(path => fs.statSync(path));
  }
try{
     if(fs.existsSync('./Backup/ProdEntrySystem/shiftData'))  
    {
        var yearList=getDirectories('./Backup/ProdEntrySystem/shiftData/');
        
        for(var i=0;i<yearList.length;i++)
            {
                var months=getDirectories('./Backup/ProdEntrySystem/shiftData/'+yearList[i]);
                var monthArray=[];
                for(var j=0;j<months.length;j++)
                {
                    var files=getFiles('./Backup/ProdEntrySystem/shiftData/'+yearList[i]+'/'+months[j]);
                    var month={'month':months[j],'files':files};
                    monthArray.push(month);
                }
                var year={'year':yearList[i], 'months':monthArray};
                years.push(year);
            }
            res.send({'years':years});
    }
     else{
       res.send({'years':[]});
     }
  }
  catch(err){
     console.log(err);
             }
  
  });

  router.post('/getFile',(req,res)=>{
    const year=req.body.year;
    const month=req.body.month;
    const file=req.body.file;

    res.download('./Backup/ProdEntrySystem/shiftData/'+year+'/'+month+'/'+file);

  });
  

router.get('/makeBackup',(req,res)=>{
    const srcDir = './public/shiftData';
    try{
      
     if(!fs.existsSync('./Backup'))  
    {
     fs.mkdirSync('./Backup')
      fs.mkdirSync('./Backup/ProdEntrySystem');
    
     }
     else{
       if(!fs.existsSync('./Backup/ProdEntrySystem'))
       {
        fs.mkdirSync('./Backup/ProdEntrySystem');
       }
       
          fse.copySync(srcDir,'./Backup/ProdEntrySystem/shiftData',{overwrite:true,recursive:true});
          res.send({'msg':'Backup Updated.'});
       
     }
  }
  catch(err){
     console.log(err);
             }
  
  });
  

module.exports = router;




