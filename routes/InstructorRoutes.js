const express = require("express")
const router = express.Router();

// const FacultyModel = require("../models/facultySchema").constructor;
// const MemberModel = require("../models/memberSchema").constructor;

// // Instructor Routes
const getDepartmentsInFac =async function(facultyName){
    const fac =await FacultyModel.findOne({facultyName: facultyName})
    return fac.departments;
};
const getCoursesInDep = async function(facultyName,departmentName){
    const deps = await getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.courses;
};
const isInstructorOfCourse = function(course,instructorID){
    const instructor = course.instructors.find(inst => inst.id === instructorID);
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
const isTAOfCourse = function(course,TAID){
    const TA = course.TAs.find(t => t.id == TAID);
    
    if(TA)
    {
        // exist
        return true;
    }
    else
    {
        return false;
    }
};
const getStaffOfDep = async function(facultyName,departmentName){
    const deps = await getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.staff;
};

// input member
router.get('/viewCoverages', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const depCourses = await getCoursesInDep(facultyName,departmentName);
    const coverages = [];
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.user.memberId))
        {
            const {courseName,assignedCount} = course;
            const cur = (assignedCount*1.0/course.courseSchedule.length) * 100;
            coverages.push({CourseName: courseName, Coverage:cur})
        }
    });
    res.send(coverages);
})

// input member
router.get('/viewCoursesAssignments', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const depCourses = await getCoursesInDep(facultyName,departmentName);
    const schedules = [];
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.user.memberId))
        {
            const {courseName,courseSchedule} = course;
            schedules.push({courseName:courseName,schedule:courseSchedule});
        }
    });
    res.send(schedules);
})

// input member & courseName
router.get('/viewOneCourseAssignments/:courseName', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const depCourses = await getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(cou => cou.courseName === req.params.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("Not authorized to view this course!");
    }
    res.send(course.courseSchedule);
})

//input member
router.get('/viewDepartmentStaff', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const depStaff = await getStaffOfDep(facultyName,departmentName);
    res.send(depStaff);
});

// input member & course
router.get('/viewCourseStaff/:courseName', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const depCourses = await getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(course => course.courseName == req.params.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId)){
        return res.status(401).send("Access denied!");
    }
    const staffInfo = {
        instructors: course.instructors,
        TAs: course.TAs
    };
    res.send(staffInfo);
})

// input: academicMemberID / courseName / slotID
router.post('/slotAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }

    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not authorized to modify this course!");
    }
    // checking that the TA is of same department && from course staff
    const TA =await MemberModel.findOne({memberId: req.body.user});
   
//     if(TA.departmentName != departmentName)
//     {
//         return res.status(406).send("Not accepted to assign an academic member from another department!");
//     }
//     if(!isTAOfCourse(course,TA.memberId))
//     {
//         return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
//     }
//     course.courseSchedule.forEach(async (slot,idx)=>{
//         if(slot._id == req.body.slotID)
//         {
//             if(slot.user)
//             {
//                return res.status(406).send("This slot is already assigned, you can delete its assigment first!");
//             }
//             // update the schedule of this member ---> adding this slot to it
//             const member = TA;
//             const tailoredSlot = {
//                 day:slot.day,
//                 time:slot.time,
//                 location:slot.location,
//                 courseName:course.courseName
//             };
//             // check if there are collisions in the member's schedule
//             const collisionSlot = member.schedule.find(slot => slot.day == tailoredSlot.day && slot.time == tailoredSlot.time)
            
//             if(collisionSlot)
//             {
//                 return res.status(406).send("This academic member has another course slot at this timing!");
//             }

            
//             course.courseSchedule[idx]={
//                 slotID: slot.slotID,
//                 day: slot.day,
//                 time: slot.time,
//                 location: slot.location,
//                 assignedMemberID: req.body.assignedMemberID,
//                 assignedMemberName: TA.name
//             };
//             course.assignedCount = course.assignedCount+1;

//             member.schedule.push(tailoredSlot);
//             await member.save();

//             res.json(member);
//         }
//     });
    
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

// input:  courseName / slotID
router.delete('/slotAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank!= "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    course.courseSchedule.forEach(async (slot,idx)=>{
        //to be _id
        if(slot.slotID == req.body.slotID)
        {
            if(!slot.assignedMemberID)
            {
                return res.status(406).send("This slot is already unassigned!");
                // or
                // return res.send();
            }
            const oldAssignedMemberID = slot.assignedMemberID;
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: "",
                assignedMemberName: ""
            };
            course.assignedCount = course.assignedCount-1;
            // update the schedule of this member ---> adding this slot to it
            const member = await MemberModel.findOne({memberId: oldAssignedMemberID});
            member.schedule = member.schedule.filter((memSlot)=>{
                return !( memSlot.day==slot.day&&memSlot.time==slot.time&&memSlot.location==slot.location&&memSlot.courseName==course.courseName );                
            });
            await member.save();

            res.json(member);
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
// input slotID & courseName & newMember

//not tested

router.put('/slotAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    // checking that the TA is of same department && from course staff
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted to assign an academic member from another department!");
    }
    if(!isTAOfCourse(course,TA.memberID))
    {
        return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
    }
    course.courseSchedule.forEach(async (slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(!slot.assignedMemberID)
            {
                return res.status(401).send("This slot is already unassigned!");
                //or course.assignedCount = course.assignedCount+1;
                //do nothing
            }
            else
            {
                const oldAssignedMemberID = slot.assignedMemberID;
                // update the schedule of old member ---> removing this slot to it
                const oldMember = await MemberModel.findOne({memberId: oldAssignedMemberID});
                oldMember.schedule = oldMember.schedule.filter((memSlot)=>{
                return !( memSlot.day==slot.day&&memSlot.time==slot.time&&memSlot.location==slot.location&&memSlot.courseName==course.courseName ); 
                });
                await oldMember.save();
            }
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: req.body.assignedMemberID,
                assignedMemberName: req.body.assignedMemberName
            };
            // update the schedule of new member ---> adding this slot to it
            const newMember = await MemberModel.findOne({memberID: req.body.assignedMemberID});
            const tailoredSlot = {
                day:slot.day,
                time:slot.time,
                location:slot.location,
                courseName:course.courseName
            };
            // check if there are collisions in the member's schedule
            const collisionSlot = member.schedule.find(slot => slot.day == tailoredSlot.day && slot.time == tailoredSlot.time)
            if(collisionSlot)
            {
                return res.status(406).send("This academic member has another course slot at this timing!");
            }
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

// input: academicMemberID / courseName
router.post('/courseAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not authorized to modify this course!");
    }
    // checking that the TA is of same department
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted to assign an academic member from another department!");
    }
    if(isTAOfCourse(course,TA.memberId))
    {
        return res.status(406).send("Not accepted! This academic member is already assigned");
        //or
        //return res.status(200).send();
    }
    const tailoredTA = {
        id: TA.memberId,
        name: TA.name,
        mail: TA.email,
        office: TA.officeLocation
    };
    course.TAs.push(tailoredTA);
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

    res.json(course);
});

// input:  courseName / memberID

//not tested
router.delete('/courseAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    // checking that the TA is of same department
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(!isTAOfCourse(course,TA.memberId))
    {
        return res.status(406).send("Not accepted! Not a staff member already");
        //or
        //return res.status(200).send();
    }
    let oldLen = TA.schedule.length;
    TA.schedule = TA.schedule.filter(s =>{
        return !(s.courseName == course.courseName)
    });
    let newLen = TA.schedule.length;
    course.assignedCount = course.assignedCount - (oldLen-newLen);
    course.TAs = course.TAs.filter(t => {
        return !(t.id == TA.memberId);
    });
    course.courseSchedule.forEach((cSlot,idx) =>{
        if((cSlot.assignedMemberID == TA.memberId)){
            cSlot.assignedMemberID="";
            cSlot.assignedMemberName="";

            course.courseSchedule[idx]=cSlot;
        }
    })
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

    res.json(course);
});


// input: academicMemberID / courseName
router.post('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName =req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not authorized to modify this course!");
    }
    // checking that the TA is of same department && from course staff
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted! The academic member is from another department");
    }
    if(!isTAOfCourse(course,TA.memberId))
    {
        return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
    }
    // if(course.coordinatorID)
    // {
    //     return res.status(406).send("Not accepted! This course already has a coordinator, you should remove him/her first");
    // }
    TA.MemberRank = "coordinator";
    await TA.save();
    course.coordinatorID = TA.memberId;
    course.coordinatorName = TA.name;
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

    res.json(TA)
});

// input:  courseName
router.delete('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    if(!course.coordinatorID)
    {
        //return res.status(406).send("Already no coordinator assigned!");
        //or
        //do nothing
        //res.status(200).send();
    }
    const TA =await MemberModel.findOne({memberID: course.coordinatorID});
    TA.MemberRank = "ta";
    await TA.save();
    course.assignedMemberID=null;
    course.assignedMemberName=null;
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
// input courseName & newMember

//not tested

router.put('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.user.MemberRank != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.user.Facultyname;
    const departmentName = req.user.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.user.memberId))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    // checking that the TA is of same department && from course staff
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted! the academic member is from another department");
    }
    if(!isTAOfCourse(course,TA.memberID))
    {
        return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
    }
    if(course.coordinatorID)
    {
        const oldTA =await MemberModel.findOne({memberID: course.coordinatorID});
        oldTA.MemberRank = "ta";
        await oldTA.save();
    }
    TA.MemberRank = "coordinator";
    await TA.save();
    course.coordinatorID = TA.memberID;
    course.coordinatorName = TA.name;
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



module.exports=router;