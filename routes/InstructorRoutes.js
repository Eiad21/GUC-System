const express = require("express")
const router = express.Router();
// const Location = require("../models/locationSchema").constructor
const FacultyModel = require("../models/facultySchema").constructor;
const MemberModel = require("../models/memberSchema").constructor;
// const Department = require("../models/departmentSchema").constructor

// Instructor Routes
// Location manipulation
const getDepartmentsInFac = async function(facultyName){
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    return fac.departments;
};
const getCoursesInDep = function(facultyName,departmentName){
    const deps = getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.courses;
};
const isInstructorOfCourse = function(course,instructorID){
    const instructor = course.instructors.find(inst => inst.memberID == instructorID);
    if(instructor)
    {
        // exist
        return true;
    }
    else
    {
        return false;
    }
};
const getStaffOfDep = function(facultyName,departmentName){
    const deps = getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.staff;
};

// input member
router.get('/viewCoverage', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const coverages = {};
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.member.memberID))
        {
            const {courseName,coverage} = course;
            coverages[courseName] = coverage;
        }
    });
    res.send(coverages);
})

// input member
router.get('/viewCoursesAssignments', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const schedules = {};
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.member.memberID))
        {
            const {courseName,courseSchedule} = course;
            schedules[courseName] = courseSchedule;
        }
    });
    res.send(schedules);
})

// input member & courseName
router.get('/viewOneCourseAssignments', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(cou => cou.courseName == req.body.courseName);
    res.send(course.courseSchedule);
})

//input member
router.get('/viewDepartmentStaff', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const depStaff = getStaffOfDep(facultyName,departmentName);
    const modifiedDepStaff = []; // will not have password and other personal info like salary.
    depStaff.forEach((staffMember)=>{
        const {name, memberId, FacultyName, departmentName, email, officeLocation, schedule} = staffMember;
        const modifiedStaffMember = {
            memberId: memberId,
            name: name,
            FacultyName: FacultyName,
            departmentName: departmentName,
            email: email,
            officeLocation: officeLocation,
            schedule: schedule
        };
        modifiedDepStaff.push(modifiedStaffMember);
    });
    res.send(modifiedDepStaff);
});

// input member & course
router.get('/viewCourseStaff', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(course => course.courseName == req.body.courseName);
    const modifiedInstructors = []; // will not have password and other personal info like salary.
    course.instructors.forEach((instructor)=>{
        const {name, memberId, FacultyName, departmentName, email, officeLocation, schedule} = instructor;
        const modifiedInstructor = {
            memberId: memberId,
            name: name,
            FacultyName: FacultyName,
            departmentName: departmentName,
            email: email,
            officeLocation: officeLocation,
            schedule: schedule
        };
        modifiedInstructors.push(modifiedInstructor);
    });
    const modifiedTAs = []; // will not have password and other personal info like salary.
    course.TAs.forEach((TA)=>{
        const {name, memberId, FacultyName, departmentName, email, officeLocation, schedule} = TA;
        const modifiedTA = {
            memberId: memberId,
            name: name,
            FacultyName: FacultyName,
            departmentName: departmentName,
            email: email,
            officeLocation: officeLocation,
            schedule: schedule
        };
        modifiedTAs.push(modifiedTA);
    });
    const staffInfo = {
        instructors: modifiedInstructors,
        TAs: modifiedTAs
    };
    res.send(staffInfo);
})

router.post('/assignAcademicMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
   // fac.departments;
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.member.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(slot.assignedMemberID)
            {
               return res.status(401).send("Cannot change already assigned slot!");
            }
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: req.body.assignedMemberID,
                assignedMemberName: req.body.assignedMemberID
            };
            // update the schedule of this member ---> adding this slot to it
            const member = await MemberModel.findOne({memberID: req.body.assignedMemberID});
            const tailoredSlot = {
                day:slot.day,
                time:slot.time,
                location:slot.location,
                courseName:course.courseName
            };
            member.schedule.push(tailoredSlot);
            await member.save();
        }
    });
    department.courses.forEach((courseItem,idx)=>{
        if(courseItem.courseName == course.courseName)
        {
            department.courses[idx]=course;
        }
    });
    fac.departments.forEach((dep,idx)=>{
        if(dep.departmentName == department.departmentName)
        {
            fac.departments[idx] = department
        }
    });
    await fac.save();
});


router.delete('/assignAcademicMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
   // fac.departments;
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.member.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            // if(!slot.assignedMemberID)
            // {
            //     return res.status(401).send("This slot is already unassigned!");
            // }
            const oldAssignedMemberID = slot.assignedMemberID;
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: null,
                assignedMemberName: null
            };
            // update the schedule of this member ---> adding this slot to it
            const member = await MemberModel.findOne({memberID: oldAssignedMemberID});
            member.schedule = member.schedule.filter((memSlot)=>{
                return !( memSlot.day==slot.day&&memSlot.time==slot.time&&memSlot.location==slot.location&&memSlot.courseName==course.courseName );
                
            });
            await member.save();
        }
    });
    department.courses.forEach((courseItem,idx)=>{
        if(courseItem.courseName == course.courseName)
        {
            department.courses[idx]=course;
        }
    });
    fac.departments.forEach((dep,idx)=>{
        if(dep.departmentName == department.departmentName)
        {
            fac.departments[idx] = department
        }
    });
    await fac.save();
});


//update
// input slotID & newMember
router.put('/assignAcademicMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.member.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.member.facultyName;
    const departmentName = req.member.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
   // fac.departments;
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.member.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(!slot.assignedMemberID)
            {
                return res.status(401).send("This slot is already unassigned!");
            }
            const oldAssignedMemberID = slot.assignedMemberID;
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: req.body.assignedMemberID,
                assignedMemberName: req.body.assignedMemberID
            };
            // update the schedule of old member ---> removing this slot to it
            const oldMember = await MemberModel.findOne({memberID: oldAssignedMemberID});
            oldMember.schedule = oldMember.schedule.filter((memSlot)=>{
                return !( memSlot.day==slot.day&&memSlot.time==slot.time&&memSlot.location==slot.location&&memSlot.courseName==course.courseName );
                
            });
            await oldMember.save();
            // update the schedule of new member ---> adding this slot to it
            const newMember = await MemberModel.findOne({memberID: req.body.assignedMemberID});
            const tailoredSlot = {
                day:slot.day,
                time:slot.time,
                location:slot.location,
                courseName:course.courseName
            };
            newMember.schedule.push(tailoredSlot);
            await newMember.save();
        }
    });
    department.courses.forEach((courseItem,idx)=>{
        if(courseItem.courseName == course.courseName)
        {
            department.courses[idx]=course;
        }
    });
    fac.departments.forEach((dep,idx)=>{
        if(dep.departmentName == department.departmentName)
        {
            fac.departments[idx] = department
        }
    });
    await fac.save();
});

router.delete("/AssignCourseTA", async(req,res,next)=>{

    // dont forget to check the memberRank should be instructor and check the department of the TA to be the same as department of Instructor in the Line Below 
    
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


router.post('/deleteLocation', async (req,res)=>{
  
    Location.findOneAndDelete(
        {locationName: req.body.locationName})
             
        .then((doc) => {
            console.log(doc);
            res.send(doc)
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
});

// Faculty manipulation
router.post('/addFaculty', async (req,res)=>{
    const faculty= await new Faculty({
        facultyName:req.body.facultyName,
        deanName:req.body.deanName,
    });
    faculty.save().then((data)=>{
        res.send(data);
        console.log(data);
    }).catch((error)=>{
        res.json(error);
        console.log(error);
    });
})

router.post('/updateFaculty', async (req,res)=>{
  
    // Find and update Faculty on facultyName
    Faculty.findOneAndUpdate(
        {facultyName: req.body.facultyNameOld},
        {
            // For values you don't wish to change enter the old value
            facultyName:req.body.facultyNameNew,
            deanName:req.body.deanName
        },
        { new: true },)
        
        .then((doc) => {
            console.log(doc);
            res.send(doc)
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
});

router.post('/deleteFaculty', async (req,res)=>{
  
    // Find and delete Faculty on facultyName
    Faculty.findOneAndDelete(
        {facultyName: req.body.facultyName})
             
        .then((doc) => {
            console.log(doc);
            res.send(doc)
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
});

// Department within Faculty manipulation
router.post('/addDepartment', async (req,res)=>{
    
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Create Department
            const department= await new Department({
                departmentName:req.body.departmentName,
                headID:req.body.headID,
                headName:req.body.headName,
            });
            // Add Faculty to the Department
            doc.departments.push(department);
            // Save the faculty
            doc.save()
            .then((doc) => {
                console.log(doc);
                res.send(doc)
              })
              .catch((err) => {
                  console.error(err);
                  res.send(err)
            }
        );


          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/updateDepartment', async (req,res)=>{
    
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Find Department
            var index
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentNameOld){
                    flag = true;
                    // For values you don't wish to change enter the old value
                    doc.departments[i].departmentName = req.body.departmentNameNew;
                    doc.departments[i].headID = req.body.headID;
                    doc.departments[i].headName = req.body.headName;
                    
                    // Save department with updated values
                    doc.save();
                    break;
                }
            }
            console.log(doc);
            res.send(doc);
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/deleteDepartment', async (req,res)=>{
    
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Find Department
            var index
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    flag = true;
                    
                    // Remove Department
                    doc.departments.splice(i, 1);
                    
                    // Save Faculty without Department
                    doc.save();
                    break;
                }
            }
            console.log(doc);
            res.send(doc);
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

module.exports=router;