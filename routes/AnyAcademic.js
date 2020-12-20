const express = require("express")
var router = express.Router();
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor
const Slot = require("../models/slotSchema").constructor
const Member = require("../models/memberSchema").constructor
const Request = require("../models/requestSchema").requestModel


app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Any Academic Routes

app.get('/schedule',async(req,res)=>{
    try {
        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        res.json(user.schedule);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


app.post('/replacementReq',async(req,res)=>{
    try{
        let {date,reason,content,reciever,comment}=req.body;
        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        
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

        const request=new Request({
            date:date,
            reason:reason,
            content:content,
            sender:user.memberId,
            reciever:reciever,
            type:"replacement",
            status:"pending",
            comment:comment

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


app.get('/replacementReq',async(req,res)=>{
    try {
        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        const all = await Request.find({type:"replacement"},{$or:[{sender: user.memberId},{reciever: user.memberId}]})
        res.json(all);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

app.post('/slotLinkReq',async(req,res)=>{
    try{
        let {reason,content,comment,slotDay,slotTime,slotLoc,slotCourse}=req.body;
        const slot=new Slot({
            day:slotDay,
            time:slotTime,
            location:slotLoc,
            courseName:slotCourse
        })
        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        
        //query to get the course coordinator
        const reciever="15701"

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
app.post('/changeDayOffReq',async(req,res)=>{
    try{
        let {reason,content,comment,newDayOff}=req.body;

        //query to get the HOD
        const reciever="15701"

        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        
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

app.get('/requests',async(req,res)=>{
    try {
        
        let {filter}=req.body;


        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});

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

app.post('/cancelReq',async(req,res)=>{
    try{
        let {_id}=req.body;

        const loggedinID="5fde5008edfe910c8c3dc6d2";
        const user=await Member.findOne({_id:loggedinID});
        
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
