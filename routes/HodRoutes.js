const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const CourseSchema = require("../models/CourseSchema").constructor
const DepartmentSchema = require("../models/departmentSchema").constructor
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


 router.post("/AssignCourseInstructor", async(req,res,next)=>{

// dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
    memberSchema.findOne({memberId:req.body.memberId},(err,doc)=>{if(err){res.send(err)}; console.log(doc)}).then(async(memberRecord)=>{
    
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
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    router.put("/AssignCourseInstructor", async(req,res,next)=>{

        // dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
            memberSchema.findOne({memberId:req.body.memberIdtodelete},(err,doc)=>{if(err){res.send(err)}; }).then(async(memberRecordtodelete)=>{
            
              if (memberRecordtodelete)
                {
                   memberSchema.findOne({memberId:req.body.memberIdtoAssign},(err,doc)=>{if(err){res.send(err)}; }).then(async(memberRecordtoAssign)=>{

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
            })

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            router.delete("/AssignCourseInstructor", async(req,res,next)=>{

                // dont forget to check the memberRank should be instructor and check the department of the instructor to be the same as department of HOD in the Line Below 
                    memberSchema.findOne({memberId:req.body.memberId},(err,doc)=>{if(err){res.send(err)}; console.log(doc)}).then(async(memberRecord)=>{
                    
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
                    })
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // view all staff            
 
 router.get("/viewallstaffInMyDepartment", async(req,res,next)=>{
     //change this hardcoded id to the id of the HOd from Token
     await DepartmentSchema.findOne({headID:"1"})
     .then((doc)=>{
         console.log(doc.staff)
         res.send(doc.staff)
     })
 })


 router.get("/viewallstaffforThisCourse/:CourseName", async(req,res,next)=>{
    //change this hardcoded id to the id of the HOd from Token
    await DepartmentSchema.findOne({headID:"1"})
    .then((doc)=>{

      const CourseRecord= doc.courses.filter((value,index)=>{return value.courseName==req.params.CourseName})
      var allcourseinsideDepartmentInstructors={Instructors:CourseRecord[0].instructors, TAs:CourseRecord[0].TAs}
     res.send(allcourseinsideDepartmentInstructors)
        
    })
})
    


 module.exports=router;