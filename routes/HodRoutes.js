const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const CourseSchema = require("../models/CourseSchema").constructor
const DepartmentSchema = require("../models/departmentSchema").constructor
const requestSchema = require("../models/requestSchema").requestModel
const attendanceSchema = require("../models/attendanceSchema").constructor
// get all instructors
 


 router.post("/AssignCourseInstructor", async(req,res,next)=>{

// dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
    if(req.user.MemberRank=="hod"){
    memberSchema.findOne({memberId:req.body.memberId,MemberRank:"instructor",departmentName:req.user.departmentName},(err,doc)=>{if(err){res.statusCode=404; res.send(err)}; console.log(doc)}).then(async(memberRecord)=>{
    
     if (memberRecord)
        {
             CourseSchema.findOne({courseName:req.body.courseName}).then (async(CourseRecord)=>{
            console.log(CourseRecord)
            if(CourseRecord)
                {
                   const foundRecord=CourseRecord.instructors.filter((value,index)=>{return value.memberId==memberRecord.memberId})
                   console.log(foundRecord)
                    if(foundRecord.length==0)
                    {    
                        var NewInstructorData=CourseRecord.instructors.concat(memberRecord)
                            CourseSchema.findOneAndUpdate(
                                {courseName:req.body.courseName},
                                {instructors:NewInstructorData},
                                 {new: true}
                            ).then((doc) => {
                                console.log(doc);
                                res.send(doc)
                              }).catch((err)=>{res.send(err)})

                    }
                    else
                    {res.send("You can not assign a course to this instructor because its already assigned to him/her")}
                }
                else{res.send("Course data not present in Database")}

    
             }).catch((err)=>{res.send(err)})

        }
        else{res.send("Member data not present in Database")
    

    }


        })
    }
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    router.put("/AssignCourseInstructor", async(req,res,next)=>{

        // dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
            if(req.user.MemberRank=="hod"){
            memberSchema.findOne({memberId:req.body.memberIdtodelete,MemberRank:"instructor",departmentName:req.user.departmentName},(err,doc)=>{if(err){res.send(err)}; }).then(async(memberRecordtodelete)=>{
            
              if (memberRecordtodelete)
                {
                   memberSchema.findOne({memberId:req.body.memberIdtoAssign,MemberRank:"instructor",departmentName:req.user.departmentName},(err,doc)=>{if(err){res.send(err)}; }).then(async(memberRecordtoAssign)=>{

                         if (memberRecordtoAssign)
                        {
                            console.log(memberRecordtoAssign)
                     // U should check that the HOd department and the department the course is in 

                CourseSchema.findOne({courseName:req.body.courseName}).then (async(CourseRecord)=>{
                   // console.log(CourseRecord)
                    if(CourseRecord)
                    {                               



                        const foundRecord=CourseRecord.instructors.filter((value,index)=>{return value.memberId==memberRecordtoAssign.memberId})
                        //console.log(foundRecord)
                          if(foundRecord.length==0)
                          {    
                              var NewInstructorData=CourseRecord.instructors.concat(memberRecordtoAssign)
                                  CourseSchema.findOneAndUpdate(
                                      {courseName:req.body.courseName},
                                      {instructors:NewInstructorData},
                                       {new: true}
                                  ).then((doc) => {

                                    const foundRecordofdelete=doc.instructors.filter((value,index)=>{return value.memberId==memberRecordtodelete.memberId})
                                    console.log(foundRecordofdelete)
                                     if(foundRecordofdelete.length==1)
                                     {    
                                         var NewInstructorData=doc.instructors.filter((value,index)=>{return value.memberId!=memberRecordtodelete.memberId})
                                             CourseSchema.findOneAndUpdate(
                                                 {courseName:req.body.courseName},
                                                 {instructors:NewInstructorData},
                                                  {new: true}
                                             ).then((doc)=>{res.send(doc)}).catch((err)=>{res.send(err)})
                 
                                     }
                                     else{res.send("The Instructor u want to delete is not assigned this course to be deleted from him/her")}



                                    }).catch((err)=>{res.send(err)})
      
                          }
                          else
                          {res.send("You can not assign a course to this instructor because its already assigned to him/her")}


                           



                     


                    }
                        else{res.send("Course data not present in Database")}
                    }).catch((err)=>{res.send(err)})


                         } 
                         else{res.send("MembertobeAssigned data not present in Database")}
                          }).catch((err)=>{res.send(err)})

                     
        
            
        
                }
                else{res.send("MembertobeDeleted data not present in Database")
            
        
            }
        
        
                }).catch((err)=>{res.send(err)})
            } else(res.status(401).send("UnAutorized"))
            })

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            router.delete("/AssignCourseInstructor", async(req,res,next)=>{
                if(req.user.MemberRank=="hod"){
                // dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
                    memberSchema.findOne({memberId:req.body.memberId,MemberRank:"instructor",departmentName:req.user.departmentName},(err,doc)=>{if(err){res.send(err)}; console.log(doc)}).then(async(memberRecord)=>{
                    
                     if (memberRecord)
                        { // U should check that the HOd department and the department the course is in 
                             CourseSchema.findOne({courseName:req.body.courseName}).then (async(CourseRecord)=>{
                            console.log(CourseRecord)
                            if(CourseRecord)
                                {
                                   const foundRecord=CourseRecord.instructors.filter((value,index)=>{return value.memberId==memberRecord.memberId})
                                   console.log(foundRecord)
                                    if(foundRecord.length==1)
                                    {    
                                        var NewInstructorData=CourseRecord.instructors.filter((value,index)=>{return value.memberId!=memberRecord.memberId})
                                            CourseSchema.findOneAndUpdate(
                                                {courseName:req.body.courseName},
                                                {instructors:NewInstructorData},
                                                 {new: true}
                                            ).then((doc) => {
                                                console.log(doc);
                                                res.send(doc)
                                              }).catch((err)=>{res.send(err)})
                
                                    }
                                    else
                                    {res.send("The Instructor u want to delete is not assigned this course to be deleted from him/her")}
                                }
                                else{res.send("Course data not present in Database")}
                
                    
                             }).catch((err)=>{res.send(err)})
                
                        }
                        else{res.send("Member data not present in Database")
                    
                
                    }
                
                
                        })
                    }     else{res.status(401).send("Access denied!")}

                    })
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // view all staff            
 
 router.get("/viewallstaffInMyDepartment", async(req,res,next)=>{
     //change this hardcoded id to the id of the HOd from Token
     if(req.user.MemberRank=="hod"){
     await DepartmentSchema.findOne({headID:req.user.memberId})
     .then((doc)=>{
         res.statusCode=200
         res.send(doc.staff)
     })
    }
 })


 router.get("/viewallstaffforThisCourse/:CourseName", async(req,res,next)=>{
    //change this hardcoded id to the id of the HOd from Token
    if(req.user.MemberRank=="hod"){
    await DepartmentSchema.findOne({headID:req.user.memberId})
    .then((doc)=>{

      const CourseRecord= doc.courses.filter((value,index)=>{return value.courseName==req.params.CourseName})
      var allcourseinsideDepartmentInstructors={Instructors:CourseRecord[0].instructors, TAs:CourseRecord[0].TAs}
     res.send(allcourseinsideDepartmentInstructors)
        
    })
    }
    else{res.status(401).send("Access denied!")}

})

router.get("/viewstaffdayoff",async(req,res)=>{
    //check if iam a Hod using id from token
    if(req.user.MemberRank=="hod"){
     await DepartmentSchema.findOne({headID:req.user.memberId}).then((doc)=>{

        var allstaffdayoffarray=[]
        doc.staff.forEach((value)=>{allstaffdayoffarray.push({Name:value.name ,Mail:value.mail,DayOff:value.dayoff})})
        if(allstaffdayoffarray!=[])
         res.status(200).send(allstaffdayoffarray)
         else(res.status(404).send("there is no Staff in Your department"))
     }).catch((err)=>{res.status(404).send("Not Found")})
    }
    else{res.status(401).send("Access denied!")}

})
    


router.get("/viewstaffdayoff/:StaffId",async(req,res)=>{
    //check if iam a Hod using id from token
    if(req.user.MemberRank=="hod"){
     await DepartmentSchema.findOne({headID:req.user.memberId}).then((doc)=>{
         var StaffDayOffArray=doc.staff.filter((value)=>{return value.id==req.params.StaffId})
         
         if(StaffDayOffArray.length==1)
         res.status(200).send({Name:StaffDayOffArray[0].name ,Mail:StaffDayOffArray[0].mail, DayOff:StaffDayOffArray[0].dayoff})
         else
         {
             res.status(404).send("this staff is not in your department")
         }
     }).catch((err)=>{res.status(404).send("Sorry you can not access this featuer because you are not a Head of any Department")})
    }
    else{res.status(401).send("Access denied!")}

})


router.get("/Requests",async(req,res)=>{
    //check if iam a Hod using id from token

if(req.user.MemberRank=="hod"){
      await DepartmentSchema.findOne({headID:req.user.memberId}).then(async(doc)=>{
         console.log(doc.departmentName)
         const allrequestinmydept=await requestSchema.find({reciever:doc.departmentName,$or:[{type:"leave"},{type:"changedayoff"}]}).catch((err)=>{res.status(400).send("Bad Request")})
         console.log(allrequestinmydept)
         res.status(200).send(allrequestinmydept)
     }).catch((err)=>{res.status(400).send("Bad Request")})
    }
    else{res.status(401).send("Access denied!")}
})



 



//either accept or rejet a request
router.post("/Requests",(req,res)=>{
    //change it to the req.role == head
    if(req.user.MemberRank=="hod")
    {
        //check if the request getting accepted is from the department of this head
        if(!req.body.id || !req.body.department || !req.body.statusType)
        {res.status(400).send("BadRequest1")}
        if(req.body.department = req.user.departmentName)
        { 


            reqcomment=""
            if(req.body.comment)
            {
                reqcomment=req.body.comment
            }
            requestSchema.findOneAndUpdate({_id:req.body.id},{status:req.body.statusType,comment:reqcomment}).then(async(doc)=>{
                // check if the status is already rejected or accepted so i cant accept it again
                //console.log(doc)
                if(doc.status=="pending")
                {
                    if(req.body.statusType=="rejected")
                {
                    res.status("200").send("Ok")
                    return;
                }
                if(req.body.statusType=="accepted")
                {
                        console.log(doc.type)
                    if(doc.type=='changedayoff')
                        {    console.log(doc.newDayOff)
                            if(doc.newDayOff && !(doc.newDayOff==""))
                            {
                               

                               await memberSchema.findOneAndUpdate({memberId:doc.sender},{dayoff:doc.newDayOff},{new: true}).catch((err)=>{res.status(404).send("Not Found")})
                                //change koftaa with req.hod.depratment
                                await DepartmentSchema.findOne({headID:req.user.memberId,departmentName:req.user.departmentName}).then((doc1)=>{
                                        console.log(doc1)
                                    const indexofmember=doc1.staff.findIndex((value)=>{return value.id==doc.sender})



                                    doc1.staff[indexofmember].dayoff=doc.newDayOff

                                    doc1.save()
                                    res.status(200).send("OK")
                                    })
                                
                            }
                        }

                    if(doc.type=="leave")
                    {
                        var attendanceRecord
                        let dateObj = new Date();
                        var month = dateObj.getUTCMonth() ; //months from 1-12
                        var day = dateObj.getUTCDate();
                        var year = dateObj.getUTCFullYear();
                        const todaysDate = new Date(year,month,day);


                        var month = doc.date.getUTCMonth() //months from 1-12
                        var day = doc.date.getUTCDate();
                        var year = doc.date.getUTCFullYear();
                        const requestleavetime = new Date(year,month,day)
                        console.log(requestleavetime)
                        console.log(todaysDate)
                      
                                if(requestleavetime-todaysDate<0)
                        {
                            attendanceSchema.findOneAndUpdate({date:requestleavetime,memberId:doc.sender},{missedDay:false}).then((docer)=>{console.log(docer)})
                           res.status(200).send("OK")
                        }
                    }

                    else{
                        res.status(400).send("Bad Request")

                    }
                }
                else
                {
                    res.status(400).send("Bad Request")
                }
                }
                else {res.status(406).send("Not Acceptable")}
            })
        }
        else {res.status(400).send("Bad Request")}

    }
    else (res.status(401).send("Access denied!"))
})






router.get("/viewcoverageofcourses",async(req,res)=>{
    if(req.user.MemberRank=="hod"){
   await DepartmentSchema.findOne({headID:req.user.memberId}).then((doc)=>{
var allcoursescoverage= [];
       doc.courses.forEach(element => {
           allcoursescoverage.push({CourseName:element.courseName, Coverage:(element.assignedCount/element.courseSchedule.length)*100})
       })
           res.status(200).send(allcoursescoverage)
      
   }).catch((err)=>{res.status(400).send("Bad Request")})
    }
    else{res.status(401).send("Access denied!")}
})



router.get('/viewteachingassignments', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    console.log(req.user.MemberRank)
    if(req.user.MemberRank != "hod")
    {
        return res.status(401).send("Access denied!");
     }
   // const facultyName ="MET" //req.signedMember.facultyName;
    console.log(req.user.memberId)
    console.log(req.user.departmentName)
    const depCourses = DepartmentSchema.findOne({headID:req.user.memberId, departmentName:req.user.departmentName}).then((doc)=>{

        const schedules = [];
        doc.courses.forEach((course)=>{
            
                const {courseName,courseSchedule} = course;
                schedules.push({CourseName: courseName , courseSchedule:courseSchedule})
            
        });
        res.send(schedules);

    }).catch(err=>res.status(404).send("Not Found"))
    
})

 module.exports=router;