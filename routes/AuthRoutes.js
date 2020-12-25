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

module.exports=router