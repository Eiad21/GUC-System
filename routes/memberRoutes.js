const { Router } = require("express");
const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const slotSchema = require("../models/slotSchema").constructor
//const authoController =require("../controllers/authController")
const bcrypt =require('bcryptjs');
// const { jsonwebtoken } = require('jsonwebtoken')
const jwt= require('jsonwebtoken')// router.route('/login').get(async(req, res)=>{
const attendanceSchema = require("../models/attendanceSchema").constructor
const signInSessionSchema = require("../models/signInSessionSchema").constructor
require('dotenv').config()
// const {email, password}=req.body


// }
//  )



router.route('/logOut')
.get(async (req, res)=>{
    console.log("hi123")
    console.log(req.headers.token);
    console.log(req.user);
    req.headers.id
  res.cookie('jwt','',{maxAge:1});
  console.log(req.headers.token);
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
    
   // res.redirect('/profile');
    res.send(req.user);
}
    )

// router.route('/updateProfile')
// .get(async (req, res )=>{
        
//     res.redirect('/updateProfile');
// }
//     )
    // router.route('/doneReturn')
    // .get(async (req, res )=>{
            
    //     res.redirect('/');
    // }
    //     )



 router.route('/updateProfile')
    .post(async (req, res )=>{
 
        let memberoz= await memberSchema.findOne( 
           
            {$and:[{email:req.user.email},{memberId:req.user.memberId}]}
                );

                if(!memberoz){
                    res.status(400).send("Not found");
                }
                if(!req.body.bio){
                    res.status(400).send("Bad request");
                }
                memberoz.bio=req.body.bio;
                await memberoz.save();
                res.send(memberoz)
            }
        
    
        )

   
 
router.route('/updatePassword')

.put(async (req, res )=>{
    const salt= await  bcrypt.genSalt(10)
  //  const correctpassword= await bcrypt.compare(req.body.password, user.password)

        if(!req.body.passwordOld){
            return res.status(400).send('You must enter your old password');
        }
        if(!req.body.passwordNew){
            return res.status(400).send('You must enter your new password');
        }
        let passwordNewHash= await  bcrypt.hash(req.body.passwordNew, salt) 

         let memberoz= await memberSchema.findOne( 
            //  {memberId: request.body.memberId}, function(err, mem) {
           
            //     if(!err)
            //     mem.password = temp;
            //    else res.send("error user not found"+err);
            //     }
            {$and:[{email:req.user.email},{memberId:req.user.memberId}]}
                );

                if(await bcrypt.compare(req.body.passwordOld, memberoz.password)){
                    memberoz.password=passwordNewHash;
                     await memberoz.save();
                     return res.send('Password chaneged')
                }

                else{return res.status(400).send('enter correct password ')}
            }
        
    
        )


router.route('/signIn')
  
//  member1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)});
    .post(async (req, res )=>{
        let dateObj = new Date();

        let temp =new signInSessionSchema({timein:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate()+1;
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =await attendanceSchema.findOne(
        //     function(elem){
        //     return elem.date==dateoz && elem.memberId==req.body.memberId;
        // }
        {$and:[{date:dateoz},{memberId:req.user.memberId}]}
        );
        if(!sess){
            console.log('day added')

            let temp2=new attendanceSchema({
                memberId:req.user.memberId,
                date:dateoz,
                sessions:[temp],
                missedDay:false

            });

            await temp2.save();
            res.send(temp2);
        }
       else{
            console.log('session added')
            sess.sessions.push(temp);
            await sess.save();
            res.send(sess);

        }


    }

                
            
)
router.route('/signOut')
  

    .post(async (req, res )=>{


        let dateObj = new Date();

        let temp =new signInSessionSchema({timeout:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate()+1;
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =await attendanceSchema.findOne(
            //     function(elem){
            //     return elem.date==dateoz && elem.memberId==req.body.memberId;
            // }
            {$and:[{date:dateoz},{memberId:req.user.memberId}]}
            );
        if(!sess){
            console.log('day added')

            let temp2=new attendanceSchema({
                memberId:req.user.memberId,
                date:dateoz,
                sessions:[temp],
                missedDay:false

            });

            attendanceSchema.push(temp2);
            await temp2.save();
            res.send(temp2);

        }
        else{
            console.log('session added' +sess)
           
            
            let len = sess.sessions.length-1; 
                 if(! sess.sessions[len].timeout){
                     const diffTime = Math.abs(dateObj - sess.sessions[len].timein);
                     const diffMinutes = Math.ceil(diffTime / (1000 * 60  )); 
                     console.log('time out added ')
                     sess.sessions[len].timeout=dateObj;
                     sess.missingMinutes=sess.missingMinutes-diffMinutes;
                     await sess.save();
                     res.send("time out added")
                 } 

                 else{
                    sess.sessions.push(temp);
                    await sess.save();
                    res.send('time out slot added ') 
                 }
        }
        
    }
                        
                    
)






router.route('/viewAttendance')
  
    .get(async (req, res )=>{
        let dateObj = new Date();

        let temp =new signInSessionSchema({timein:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate()+1;
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =await attendanceSchema.find(
            {memberId:req.body.memberId});
        if(sess){

            res.send(sess);
        }
       else{
           res.send("no attendance")

        }


    }

                
            
)











/////// same method viewStuffAttendance
router.post('/viewMyAttendance', async (req,res)=>{
    //const loc = await Location.find({locationType:"Office"},{locationName:1, _id:0}).distinct('locationName');
    //const loc = await Location.find({$and: [{capacity: {$gt: 5}}, {population: 0}]});
    const sessionsMissed = 
        await attendanceSchema.find( {memberId:req.user.memberId} ,{missedDay:1, _id:0,missedDay:1});
    //console.log(timeArray)

  

   // console.log(sum)
    res.send(sessionsMissed)
    // const membersMissingTime = await Member.find({memberId: {$in:membersIDsMissingTime}})

    // console.log(membersMissingTime);
    // res.send(membersMissingTime);
})


//////////////////////////viewMembersMissingHoursAndExtraHours
router.post('/viewMembersMissingHoursAndExtraHours', async (req,res)=>{
    //const loc = await Location.find({locationType:"Office"},{locationName:1, _id:0}).distinct('locationName');
    //const loc = await Location.find({$and: [{capacity: {$gt: 5}}, {population: 0}]});
    const timeArray = 
        await attendanceSchema.find( {memberId:req.user.memberId} ,{missingMinutes:1, _id:0});
    //console.log(timeArray)

    let sum=0;
    for (i in timeArray) 
    {
        sum=sum+timeArray[i].missingMinutes
    }

   // console.log(sum)
    res.send(sum/60)
    // const membersMissingTime = await Member.find({memberId: {$in:membersIDsMissingTime}})

    // console.log(membersMissingTime);
    // res.send(membersMissingTime);
})

module.exports=router