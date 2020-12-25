const { Router } = require("express");
const express = require("express");
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
//const authoController =require("../controllers/authController")
const bcrypt =require('bcryptjs');
// const { jsonwebtoken } = require('jsonwebtoken')
const jwt= require('jsonwebtoken')// router.route('/login').get(async(req, res)=>{
require('dotenv').config()


/////////////////////////////////////////////////
router.route('/logIn')
.post(async (req, res)=>{
    if(!req.body.email){
        return res.status(401).send('You must enter an email');
    }
    if(!req.body.password){
        return res.status(401).send('You must enter a password');
    }
    const user= await memberSchema.findOne({email : req.body.email})
    if(!user){
        return res.status(401).send('You must sign up first');
    }

    const correctpassword= await bcrypt.compare(req.body.password, user.password)
    if(!correctpassword){
        return res.status(400).send('Invalid Password')
    }
    const token= jwt.sign(
        {
    //         _id: user._id,
    // role: user.role

        name:user.name,
        gender:user.gender,
        memberId:user.memberId,
        Facultyname:user.Facultyname,
        departmentName:user.departmentName,
        email:user.email,
        //password:hashedPass,

        salary:user.salary,
        officeLocation:user.officeLocation,
        MemberRank:user.MemberRank,
        dayoff:user.dayoff,
        schedule:user.schedule

    
}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

///////////////////////////////////////////////////////

router.post('/addHr', async (req,res)=>{

    var prefix = "hr-";
    const num = await Counter.findOne({counterName:prefix});
    if(!num){
        const count = await new Counter({
            counterName:"hr-",
            counterCount:1
        });
        prefix+="1";
        await count.save();
    }
    else{
        res.status(401).send("1 or more HR members already exist in the database")
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash("123456", salt);
    console.log(prefix);
    const member = await new Member({
         name:"default default",
         gender:"M",
         memberId:"hr-1",
         email:"default.default@guc.edu.eg",
         password:hashedPass,
         MemberRank:"hr"
     });

    member.save().then((data)=>{
         res.send(data);
         console.log(data);
     }).catch((error)=>{
         res.json(error);
         console.log(error);
     });
})

module.exports=router