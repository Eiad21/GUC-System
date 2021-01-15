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

const getDepartmentsInFac =async function(facultyName){
    const fac =await Faculty.findOne({facultyName: facultyName})
    return fac.departments;
};
const getCoursesInDep = async function(facultyName,departmentName){
    const deps = await getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.courses;
};


// return user.schedule
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

// sending replacement request
router.post('/replacementReq',async(req,res)=>{
    try{
        let {dateYear,dateMonth,dateDay,reason,content,comment,reciever,time ,location,slotCourse}=req.body;
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }
        if(!dateYear || !dateMonth || !dateDay){
            return res.status(400).json({msg:"Date is required"});
        }
        const date=new Date(
            dateYear,
            dateMonth,
            dateDay
        )
        const dow=date.getDay();
          let weekDays=["sun","mon","tue","wed","thu","fri","sat"];

          const day =weekDays[dow];

        if(!time){
            return res.status(400).json({msg:"Slot info is required"});
        }
        if(!location){
            return res.status(400).json({msg:"Slot info is required"});
        }
        if(!slotCourse){
            return res.status(400).json({msg:"Slot info is required"});
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

        if(!userReciever){
            return res.status(400).json({msg:"Reciever is not valid"});
        }

        //query to get the course
        const course=await Course.findOne({courseName:slotCourse});

        if(!course){
            return res.status(400).json({msg:"Slot Course is not valid"});
        }

        console.log(user)
        console.log(user.schedule)
        const theSlot=user.schedule.find((slot)=>{
          return (slot.day==day&&slot.time==time&&slot.location==location)
        });

        if(!theSlot){
            return res.status(400).json({msg:"Slot is not valid"});
        }

        var clash = false;
        for(i in userReciever.schedule){
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
            slotCourse:slotCourse,
            slotTime:time
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


router.get('/sentReplacementReq',async(req,res)=>{
    try {
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        const all = await Request.findMany({type:"replacement", sender: user.memberId})
        res.json(all);

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get('/recievedReplacementReq',async(req,res)=>{
    try {
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        const all = await Request.findMany({type:"replacement", reciever: user.memberId})
        res.json(all);

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})



router.post('/acceptReplacementReq',async(req,res)=>{
    try {
        let {repId}=req.body;
        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!repId){
            return res.status(400).json({msg:"invalid request"});
        }

        //update the record
        Request.findOneAndUpdate(
            {_id: repId},
            {
                status:"accepted"
            },
            { new: true })

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
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!repId){
            return res.status(400).json({msg:"invalid request"});
        }

        //update the record
        Request.findOneAndUpdate(
            {_id: repId},
            {
                status:"rejected"
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
        let {reason,content,comment,day,time,location,slotCourse}=req.body;

        const user=req.user;
        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }
        //query to get the course coordinator
        const courses=await getCoursesInDep(user.Facultyname,user.departmentName)
        const course=courses.find((cur)=>cur.courseName==slotCourse);
        const reciever=course.coordinatorID

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
            slotDay:day,
            slotTime:time,
            slotLocation:location
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
//    res.send("kofta kbeera")
})
router.post('/changeDayOffReq',async(req,res)=>{
    try{
        let {reason,content,comment,newDayOff}=req.body;
         const user=req.user;

        //query to get the HOD
        const deps = await getDepartmentsInFac(user.Facultyname);
        const dep = deps.find(dep => dep.departmentName == user.departmentName);
        const reciever=dep.headID

        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
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
    //res.send("omar gada3")
})

router.get('/sentRequests',async(req,res)=>{
    try {

        let {filter}=req.body;


        const user=req.user;

        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!filter){
            const all = await Request.find({sender: user.memberId})
            res.json(all);
        }
        else{
            if(filter=="accepted"){
                const all = await Request.find({status:'accepted', sender: user.memberId})
                res.json(all);
            }
            else{
                if(filter=="rejected"){
                    const all = await Request.find({status:'rejected',sender: user.memberId})
                    res.json(all);
                }else{
                    const all = await Request.find({status:'pending',sender: user.memberId})
                    res.json(all);

                }
            }
        }



    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


router.get('/recievedRequests',async(req,res)=>{
    try {

        let {filter}=req.body;


        const user=req.user;

        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        if(!filter){
            const all = await Request.find({reciever: user.memberId})
            res.json(all);
        }
        else{
            if(filter=="accepted"){
                const all = await Request.find({status:'accepted', reciever: user.memberId})
                res.json(all);
            }
            else{
                if(filter=="rejected"){
                    const all = await Request.find({status:'rejected',reciever: user.memberId})
                    res.json(all);
                }else{
                    const all = await Request.find({status:'pending',reciever: user.memberId})
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

        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }

        const request=await Request.findOne({_id:_id});

        if(request.sender!=user.memberId){
            return res.status(400).json({msg:"Access denied"});
        }

        if(request.status=='pending'){
            await Request.findOneAndRemove({_id:_id});
            res.json(request);
            return;
        }
        if(!request.date){
            await Request.findOneAndRemove({_id:_id});
            res.json(request);
            return;
        }

        var todaysDate = new Date();
        var reqDate = new Date(request.date)
        if(reqDate>todaysDate) {
            await Request.findOneAndRemove({_id:_id});
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
        let {dateYear,dateMonth,dateDay,reason,content,comment,type}=req.body;

        const user=req.user;

        if(!(user.memberId[0]=='a' && user.memberId[1]=='c')){
            return res.status(400).json({msg:"Access denied"});
        }
        if(!dateYear || !dateMonth || !dateDay){
            return res.status(400).json({msg:"Date is required"});
        }
        const date=new Date(
            dateYear,
            dateMonth,
            dateDay
        )
        //query to get the HOD
        const deps = await getDepartmentsInFac(user.Facultyname);
        const dep = deps.find(dep => dep.departmentName == user.departmentName);
        const reciever=dep.headID


        if(!type){
            return res.status(400).json({msg:"Type is required"});
        }

        if(type=='annual_leave'){
            if(!dateYear || !dateMonth || !dateDay){
                return res.status(400).json({msg:"Date is required"});
            }
            if(new Date(date)<=new Date()) {
                return res.status(400).json({msg:"Annual leaves should be submitted before the targeted day"});
            }

            const replacements=await Request.find({date:date,sender:user.memberId,status:"accepted"});

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


        return res.status(400).json({msg:"Type not valid"});


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
