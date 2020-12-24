const express = require("express")
const router = express.Router();
// const Location = require("../models/locationSchema").constructor
const FacultyModel = require("../models/facultySchema").constructor;
const MemberModel = require("../models/memberSchema").constructor;
// const Department = require("../models/departmentSchema").constructor

// Instructor Routes
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
const isTAOfCourse = function(course,TAID){
    const TA = course.TAs.find(t => t.memberID == TAID);
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
const getStaffOfDep = function(facultyName,departmentName){
    const deps = getDepartmentsInFac(facultyName);
    const department = deps.find(dep => dep.departmentName == departmentName);
    return department.staff;
};

// input member
router.get('/viewCoverages', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const coverages = {};
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.signedMember.memberID))
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
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const schedules = {};
    depCourses.forEach((course)=>{
        if(isInstructorOfCourse(course,req.signedMember.memberID))
        {
            const {courseName,courseSchedule} = course;
            schedules[courseName] = courseSchedule;
        }
    });
    res.send(schedules);
})

// input member & courseName
router.get('/viewOneCourseAssignments/:courseName', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(cou => cou.courseName == req.params.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("Not authorized to view this course!");
    }
    res.send(course.courseSchedule);
})

//input member
router.get('/viewDepartmentStaff', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const depStaff = getStaffOfDep(facultyName,departmentName);
    res.send(depStaff);
});

// input member & course
router.get('/viewCourseStaff/:courseName', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const depCourses = getCoursesInDep(facultyName,departmentName);
    const course = depCourses.find(course => course.courseName == req.params.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
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
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("You are not authorized to modify this course!");
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
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(slot.assignedMemberID)
            {
               return res.status(406).send("This slot is already assigned, you can delete its assigment first!");
            }
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: req.body.assignedMemberID,
                assignedMemberName: req.body.assignedMemberName
            };
            // update the schedule of this member ---> adding this slot to it
            const member = await MemberModel.findOne({memberID: req.body.assignedMemberID});
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

// input:  courseName / slotID
router.delete('/slotAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(!slot.assignedMemberID)
            {
                // return res.status(406).send("This slot is already unassigned!");
                // or
                // return res.send();
            }
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
// input slotID & courseName & newMember
router.put('/slotAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
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
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            if(!slot.assignedMemberID)
            {
                //return res.status(401).send("This slot is already unassigned!");
                //or
                //do nothing
            }
            else
            {
                const oldAssignedMemberID = slot.assignedMemberID;
                // update the schedule of old member ---> removing this slot to it
                const oldMember = await MemberModel.findOne({memberID: oldAssignedMemberID});
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
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("You are not authorized to modify this course!");
    }
    // checking that the TA is of same department
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted to assign an academic member from another department!");
    }
    if(isTAOfCourse(course,TA.memberID))
    {
        //return res.status(406).send("Not accepted! This academic member is already assigned");
        //or
        //return res.status(200).send();
    }
    const tailoredTA = {
        id: TA.memberID,
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
});

// input:  courseName / memberID
router.delete('/courseAcadMember', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("You are not an instructor for this course!");
    }
    // checking that the TA is of same department
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(!isTAOfCourse(course,TA.memberID))
    {
        //return res.status(406).send("Not accepted! Not a staff member already");
        //or
        //return res.status(200).send();
    }
    course.TAs = course.TAs.filter(t => {
        return !(t.id == TA.memberID && t.name == TA.name && t.mail == TA.email && t.office == TA.officeLocation);
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
router.post('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
    {
        return res.status(401).send("You are not authorized to modify this course!");
    }
    // checking that the TA is of same department && from course staff
    const TA =await MemberModel.findOne({memberId: req.body.memberID});
    if(TA.departmentName != departmentName)
    {
        return res.status(406).send("Not accepted! The academic member is from another department");
    }
    if(!isTAOfCourse(course,TA.memberID))
    {
        return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
    }
    if(course.coordinatorID)
    {
        return res.status(406).send("Not accepted! This course already has a coordinator, you should remove him/her first");
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

// input:  courseName
router.delete('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
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
router.put('/courseCoordinator', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.role != "instructor")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const course = department.courses.find(course => course.courseName == req.body.courseName);
    if(!isInstructorOfCourse(course,req.signedMember.memberID))
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