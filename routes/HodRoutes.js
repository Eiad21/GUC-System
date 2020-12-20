const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
// get all instructors
 router.get("/", async(req,res,next)=>{

memberSchema.find({Facultyname:"Pharmacy"},(err,user)=>{
        if(err) 
        {
        res.send(err)
        }  
        console.log(user) 
        res.send(user)
    })
 }
 )

 module.exports=router;