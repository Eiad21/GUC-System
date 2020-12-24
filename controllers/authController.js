// const memberSchema =require('../models/memberSchema')
// const bcrypt =require('bcryptjs')
// const { jsonwebtoken } = require('jsonwebtoken')
// var jwt =require(jsonwebtoken)


// const register =(req,res,next)=>{
//     bcrypt.hash(req.body.password,10,function(err,hashedPass){
//         if(err){
//             res.json({error:err
//             })
//         }


        //     member=new memberSchema({
        //     name:req.body.name,
        //     gender:req.body.gender,
        //     memberId:req.body.memberId,
        //     Facultyname:req.body.Facultyname,
        //     department:req.body.department,
        //     email:req.body.email,
        //     password:hashedPass,
        //     salary:req.body.salary,
        //     officeLocation:req.body.officeLocation,
        //     schedule:req.body.schedule
    
        // })
    
    
//         member.save()
//         .then(member=>{
//             res.json({
//                 message:'user added '
//             })
//         } )
//         .catch(error=>{
    
//             res.json({
//                 message:'error occured'
//             })
//         })

//     } )


// }
//     module.exports = {
//         register
//     }
