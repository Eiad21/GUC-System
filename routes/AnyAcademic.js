const express = require("express")
var router = express.Router();
const bcrypt = require("bcrypt")
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor
const Slot = require("../models/slotSchema").constructor
const Member = require("../models/memberSchema").constructor
const Request = require("../models/requestSchema").requestModel
const Course = require("../models/CourseSchema").constructor
const Department = require("../models/departmentSchema").constructor
require('dotenv').config()

// Any Academic Routes

router.get('/schedule',async(req,res)=>{
    try {
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        res.json(user.schedule);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


router.post('/replacementReq',async(req,res)=>{
    try{
        let {date,reason,content,reciever,comment,slotId,slotCourse}=req.body;
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!slotId){
            return res.status(400).json({msg:"Slot Id is required"});
        }
        if(!slotCourse){
            return res.status(400).json({msg:"Slot Course is required"});
        }

        if(!date){
            return res.status(400).json({msg:"Date is required"});
        }
        if(!reciever){
            return res.status(400).json({msg:"Reciever is required"});
        }
        if(!reason){
            reason="";
        }
        if(!comment){
            comment="";
        }
        
        if(!content){
            content="";
        }
        
        const userReciever=await Member.findOne({memberId:reciever});

        //query to get the course
        const course=await Course.findOne({courseName:slotCourse});

        if(!course){
            return res.status(400).json({msg:"Slot Course is not valid"});
        }

        const theSlot=course.courseSchedule.find({slotID:slotId});
        
        if(!theSlot){
            return res.status(400).json({msg:"Slot is not valid"});
        }

        var clash = false;
        for(i in user.schedule){
            if(userReciever.schedule[i].day === theSlot.day && userReciever.schedule[i].time === theSlot.time){
                clash=true;
            }
        }

        if(clash){
            return res.status(400).json({msg:"The Reciever already has a slot at this time"});
        }

        const request=new Request({
            date:date,
            reason:reason,
            content:content,
            sender:user.memberId,
            reciever:reciever,
            type:"replacement",
            status:"pending",
            comment:comment,
            slotId:slotId,
            slotCourse:slotCourse
        })
        request.save().then((data)=>{
            res.json(data);
        }).catch((error)=>{
            res.json(error);
        });
    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
})


router.get('/replacementReq',async(req,res)=>{
    try {
        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        const all = await Request.find({type:"replacement"},{$or:[{sender: user.memberId},{reciever: user.memberId}]})
        res.json(all);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/acceptReplacementReq',async(req,res)=>{
    try {
        let {repId}=req.body;
        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }
        
        if(!repId){
            return res.status(400).json({msg:"invalid request"});
        }

        //update the record
        Request.findOneAndUpdate(
            {_id: repId},
            {
                status:accepted
            },
            { new: true },)
            
            .then((doc) => {
                res.send(doc)
              })
              .catch((err) => {
                  res.send(err)
            }
        );

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/rejectReplacementReq',async(req,res)=>{
    try {
        let {repId}=req.body;
        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!repId){
            return res.status(400).json({msg:"invalid request"});
        }

        //update the record
        Request.findOneAndUpdate(
            {_id: repId},
            {
                status:accepted
            },
            { new: true },)
            
            .then((doc) => {
                res.send(doc)
              })
              .catch((err) => {
                  res.send(err)
            }
        );
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/slotLinkReq',async(req,res)=>{
    try{
        let {reason,content,comment,slotDay,slotTime,slotLoc,slotCourse}=req.body;
        const slot=new Slot({
            day:slotDay,
            time:slotTime,
            location:slotLoc,
            courseName:slotCourse
        })
        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        //query to get the course coordinator
        const course=await Course.findOne({courseName:slotCourse});
        const reciever=course.coordiantorID

        if(!reason){
            reason="";
        }
        if(!comment){
            comment="";
        }
        
        if(!content){
            content="";
        }

        const request=new Request({
            reason:reason,
            content:content,
            sender:user.memberId,
            reciever:reciever,
            type:"slot_linking",
            status:"pending",
            comment:comment,
            slot:slot
        })
        request.save().then((data)=>{
            res.json(data);
        }).catch((error)=>{
            res.json(error);
        });
    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
})
router.post('/changeDayOffReq',async(req,res)=>{
    try{
        let {reason,content,comment,newDayOff}=req.body;

        //query to get the HOD
        const dep=await Department.findOne({departmentName:user.department});
        const reciever=dep.headID

        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!newDayOff){
            return res.status(400).json({msg:"New Day Off is required"});
        }

        if(!reason){
            reason="";
        }
        if(!comment){
            comment="";
        }
        
        if(!content){
            content="";
        }

        const request=new Request({
            reason:reason,
            content:content,
            sender:user.memberId,
            reciever:reciever,
            type:"change_day_off",
            status:"pending",
            comment:comment,
            newDayOff:newDayOff

        })
        request.save().then((data)=>{
            res.json(data);
        }).catch((error)=>{
            res.json(error);
        });
    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get('/requests',async(req,res)=>{
    try {
        
        let {filter}=req.body;


        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!filter){
            const all = await Request.find({$or:[{sender: user.memberId},{reciever: user.memberId}]})
            res.json(all);
        }
        else{
            if(filter=="accepted"){
                const all = await Request.find({status:'accepted'},{$or:[{sender: user.memberId},{reciever: user.memberId}]})
                res.json(all);
            }
            else{
                if(filter=="rejected"){
                    const all = await Request.find({status:'rejected'},{$or:[{sender: user.memberId},{reciever: user.memberId}]})
                    res.json(all);
                }else{
                    const all = await Request.find({status:'pending'},{$or:[{sender: user.memberId},{reciever: user.memberId}]})
                    res.json(all);
                    
                }
            }
        }

        
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/cancelReq',async(req,res)=>{
    try{
        let {_id}=req.body;

        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        const request=await Request.findOne({_id:_id});
        
        if(request.status=='pending'){
            Request.findOneAndRemove({_id:_id});
            res.json(request);
            return;
        }
        if(!request.date){
            Request.findOneAndRemove({_id:_id});
            res.json(request);
            return;
        }
        
        var todaysDate = new Date();
        var reqDate = new Date(request.date)
        if(reqDate>todaysDate) {
            Request.findOneAndRemove({_id:_id});
            res.json(request);
            return;
        }
        return res.status(400).json({msg:"Cannot cancel this request"});
        

    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/submitLeaves',async(req,res)=>{
    try{
        let {date,reason,content,comment,type,theReplacementId}=req.body;

        const user=req.user;
        
        if(!(user.memberId[0]!='a' && user.memberId[1]!='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        //query to get the HOD
        const dep=await Department.findOne({departmentName:user.department});
        const reciever=dep.headID


        if(!type){
            return res.status(400).json({msg:"Type is required"});
        }

        if(type=='annual_leave'){
            if(!date){
                return res.status(400).json({msg:"Date is required"});
            }
            if(new Date(date)<=new Date()) {
                return res.status(400).json({msg:"Annual leaves should be submitted before the targeted day"});
            }

            const replacements=await Request.find({date:date,sender:user.memberId,status:accepted});

            const request=new Request({
                date:date,
                reason:reason,
                content:content,
                sender:user.memberId,
                reciever:reciever,
                type:type,
                comment:comment,
                status:"pending",
                Replacements:replacements
    
            })
            request.save().then((data)=>{
                res.json(data);
            }).catch((error)=>{
                res.json(error);
            });

            return;
        }

        if(type=='accidental_leave'){
            if(!date){
                return res.status(400).json({msg:"Date is required"});
            }
            const request=new Request({
                date:date,
                reason:reason,
                content:content,
                sender:user.memberId,
                reciever:reciever,
                type:type,
                comment:comment,
                status:"pending"
    
            })
            request.save().then((data)=>{
                res.json(data);
            }).catch((error)=>{
                res.json(error);
            });

            return;
        }

        if(type=='sick_leave'){
            if(!date){
                return res.status(400).json({msg:"Date is required"});
            }
            const diffTime = new Date() - new Date(date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(new Date(date)<=new Date() && diffDays>3) {
                return res.status(400).json({msg:"Sick leave can not be submitted after three days from the sick day"});
            }
            const request=new Request({
                date:date,
                reason:reason,
                content:content,
                sender:user.memberId,
                reciever:reciever,
                type:type,
                comment:comment,
                status:"pending"
    
            })
            request.save().then((data)=>{
                res.json(data);
            }).catch((error)=>{
                res.json(error);
            });

            return;
        }

        if(type=='maternity_leave'){
            if(!date){
                return res.status(400).json({msg:"Date is required"});
            }
            if(user.gender=='male'){
                return res.status(400).json({msg:"Maternity leaves should only be submitted by female staff members"});
            }
            const request=new Request({
                date:date,
                reason:reason,
                content:content,
                sender:user.memberId,
                reciever:reciever,
                type:type,
                comment:comment,
                status:"pending"
    
            })
            request.save().then((data)=>{
                res.json(data);
            }).catch((error)=>{
                res.json(error);
            });

            return;
        }
        
        if(type=='compensation_leave'){
            if(!date){
                return res.status(400).json({msg:"Date is required"});
            }
            if(!reason){
                return res.status(400).json({msg:"Reason is required"});
            }
            const request=new Request({
                date:date,
                reason:reason,
                content:content,
                sender:user.memberId,
                reciever:reciever,
                type:type,
                comment:comment,
                status:"pending"
    
            })
            request.save().then((data)=>{
                res.json(data);
            }).catch((error)=>{
                res.json(error);
            });

            return;
        }
        
        
    }
    catch (error) {
        res.status(500).json({error:error.message})
    }
})


module.exports=router;


//pushing dummy records
app.post('/schedule',(req,res)=>{
    const location=new Location({
        locationName:"C7",
            size:40,
            locationType:"exams"
    })
    const slot=new Slot({
        day:req.body.day,
        time:req.body.time,
         location:location,
        course:req.body.course
    })
    slot.save().then((data)=>{
        res.json(data);
    }).catch((error)=>{
        res.json(error);
    });
})

app.post('/member',async(req,res)=>{
    const curFaculty=new Faculty({
        facultyName:"MET",
        deanID:"1234",
        deanName:"name"
    })
    curFaculty.save().then((data)=>{
        
    }).catch((error)=>{
        res.json(error);
        return;
    });
    const all = await Slot.find();

    const curMem=new Member({
        name:"sawan",
        memberId:"15702",
        Facultyname:"MET",
        department:"MET",
        email:"oSAWAN",
        password:"Sawan",
        schedule:all
    })

    curMem.save().then((data)=>{
        res.json(data);
    }).catch((error)=>{
        res.json(error);
    });
})

//getters for debugging
app.get('/member',async(req,res)=>{
    try {
        const all = await Member.find();
        res.json(all);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})
