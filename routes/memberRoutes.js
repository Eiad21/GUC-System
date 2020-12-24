const { Router } = require("express");
const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const slotSchema = require("../models/slotSchema").constructor
//const authoController =require("../controllers/authController")
const bcrypt =require('bcryptjs');
// const { jsonwebtoken } = require('jsonwebtoken')
const jwt= require('jsonwebtoken')// router.route('/login').get(async(req, res)=>{

// const {email, password}=req.body


// }
//  )


//////////////////////////////////////////////////
 router.route('/logIn')
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

///////////////////////////////////////////////////////
router.route('/logOut')
.get(async (req, res)=>{
    
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/');
}
    )

/// authentication 
// module.exports= (req, res, next)=>{
//     const token= req.headers.token
//     if(!token)  
//     {
//         res.status(401).status('Access deined')
//     }
//     try{
//         const verified= jwt.verify(token, process.env.TOKEN_SECRET)
//         req.user= verified
//         next()
//     }
//     catch(err){
//         res.status(400).send('Invalid Request')
//     }
// }

///////////////////////////////////


router.route('/viewProfile')
.get(async (req, res )=>{
    
    res.redirect('/profile');
    res.send(req.header.token);
}
    )

router.route('/updateProfile')
.get(async (req, res )=>{
        
    res.redirect('/updateProfile');
}
    )
    router.route('/doneReturn')
    .get(async (req, res )=>{
            
        res.redirect('/');
    }
        )



 router.route('/updateEmail')
    .put(async (req, res )=>{
 
        memberSchema.findOne({memberId: request.body.memberId}, function(err, mem) {
            
                if(!err)
                mem.name = request.body.name;
               else res.send("error user not found"+err);
                }
                );
            }
        
    
        )

        router.route('/updateEmail')
        .put(async (req, res )=>{
     
            memberSchema.findOne({memberId: request.body.memberId}, function(err, mem) {
                
                    if(!err)
                    mem.name = request.body.name;
                   else res.send("error user not found"+err);
                    }
                    );
                }
            
        
            )
 
router.route('/updatePassword')
  

.put(async (req, res )=>{
    const salt= await  bcrypt.genSalt(10)
    let temp= await  bcrypt.hash(req.body.password, salt) 
        if(! req.body.password){
            res.send('You must sign up with password')
        }
          memberSchema.findOne( {memberId: request.body.memberId}, function(err, mem) {
           
                if(!err)
                mem.password = temp;
               else res.send("error user not found"+err);
                }
                );
            }
        
    
        )
module.exports=router