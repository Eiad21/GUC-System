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


router.route('/signIn')
  
//  member1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)});
    .post(async (req, res )=>{
        let dateObj = new Date();

        let temp =new signInSessionSchema({timein:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =attendanceSchema.findOne(function(elem){
            return elem.date==datoz && elem.memberId==req.body.memberId;
        });
        if(!sess){
            console.log('day added')

            let temp2=new attendanceSchema({
                memberId:req.body.memberId,
                date:dateoz,
                sessions:[temp],
                missingMinutes:120,
                missedDay:true

            });

            attendanceSchema.push(temp2);
            res.send(temp2);
        }
        else{
            console.log('session added')
            sess.sessions.push(temp);

        }


    }

                
            
)
router.route('/signOut')
  

    .post(async (req, res )=>{
        
           
        





        let dateObj = new Date();

        let temp =new signInSessionSchema({timeout:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =attendanceSchema.findOne(function(elem){
            return elem.date==datoz && elem.memberId==req.body.memberId;
        });
        if(!sess){
            console.log('day added')

            let temp2=new attendanceSchema({
                memberId:req.body.memberId,
                date:dateoz,
                sessions:[temp],
                missingMinutes:120,
                missedDay:true

            });

            attendanceSchema.push(temp2);
            res.send(temp2);
        }
        else{
            console.log('session added')
           
            
            let len = sess.sessions.length-1; 
                 if(! sess.sessions[len].timeout){
                     const diffTime = Math.abs(dateObj - sess.sessions[len].timein);
                     const diffMinutes = Math.ceil(diffTime / (1000 * 60  )); 
                     console.log('time out added ')
                     sess.sessions[len].timeout=dateObj;
                     sess.missingMinutes=sess.missingMinutes-diffMinutes;
                     res.send("time out added")
                 } 

                 else{
                    sess.sessions.push(temp);
                    res.send('time out slot added ') 
                 }

        }









        
    }
                        
                    
)






router.route('/viewAttendancee')
  
    .get(async (req, res )=>{
        let dateObj = new Date();

        let temp =new signInSessionSchema({timein:dateObj 
        });

        let month = dateObj.getUTCMonth() ; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let dateoz = new Date(year,month,day);

        const sess =attendanceSchema.filter(function(elem){
            elem.memberId==req.body.memberId;
        });
        if(sess.length==0){
            console.log('no attendance yet')

            
        }
        else{
            console.log('attendance list ')
            res.send(sess)

        }


    }

                
            
)











/////// same method viewStuffAttendance
router.post('/viewMyAttendance', async (req,res)=>{
    
    Attendance.findOne(
        {memberId:req.body.memberId}
    )
    .then((doc) =>{
        if(!doc){
            //not found
        }
        res.send(doc)
        console.log(doc)
    })
    .catch((err) => {
        console.error(err);
        res.send(err)
  }
);
})
//////////////////////////viewMembersMissingHoursAndExtraHours
router.post('/viewMembersMissingHoursAndExtraHours', async (req,res)=>{
    //const loc = await Location.find({locationType:"Office"},{locationName:1, _id:0}).distinct('locationName');
    //const loc = await Location.find({$and: [{capacity: {$gt: 5}}, {population: 0}]});
    const membersIDsMissingTime = 
        await Attendance.find( {$or: [{missedDay: true}, {missingMinutes: {$gt: 0}}]} ,{memberId:1, _id:0}).distinct('memberId');
    
    const membersMissingTime = await Member.find({memberId: {$in:membersIDsMissingTime}})

    console.log(membersMissingTime);
    res.send(membersMissingTime);
})

module.exports=router