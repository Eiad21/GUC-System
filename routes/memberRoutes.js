const { Router } = require("express");
const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const slotSchema = require("../models/slotSchema").constructor
//const authoController =require("../controllers/authController")
const bcrypt =require('bcryptjs')
// const { jsonwebtoken } = require('jsonwebtoken')
var jwt =require(jsonwebtoken)

// router.route('/login').get(async(req, res)=>{

// const {email, password}=req.body


// }
//  )



 router.route('/login')
.post(async (req, res)=>{
    const user= await memberSchema.findOne({email : req.body.email})
    if(user == null){
        return res.send('You must sign up first')
    }
    const correctpassword= await bcrypt.compare(req.body.password, user.password)

    if(!correctpassword){
        return res.status(400).send('Invalid Password')
    }
    const token= jwt.sign(
        {
    //         _id: user._id,
    // role: user.role

        name:user.body.name,
        gender:user.body.gender,
        memberId:user.body.memberId,
        Facultyname:user.body.Facultyname,
        departmentName:user.body.departmentName,
        email:user.body.email,
        //password:hashedPass,

        salary:user.body.salary,
        officeLocation:user.body.officeLocation,
        MemberRank:user.body.MemberRank,
        dayoff:user.body.dayoff,
        schedule:user.body.schedule

    
}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})
module.exports=router