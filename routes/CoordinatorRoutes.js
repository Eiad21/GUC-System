const express = require("express")
const router = express.Router();

const FacultyModel = require("../models/facultySchema").constructor;
const MemberModel = require("../models/memberSchema").constructor;
const RequestModel = require("../models/requestSchema").constructor;
const CourseSlotModel = require("../models/courseSlotSchema").constructor;

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


const getCoursesCoordinated = function(depCourses, coordiantorID){
    const res = depCourses.filter(course => course.coordiantorID == coordiantorID);
    return res;
}


// input: nothing
router.get('/viewSlotLinkingReqs', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.MemberRank != "coordinator")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const coursesCoordinated = getCoursesCoordinated(department.courses, req.signedMember.memberID);

    allRequests={};
    coursesCoordinated.forEach((course)=>{
            
            const {courseName} = course;
            const reqs = await RequestModel.findMany({reciever: courseName, type:"slot_linking"});
            allRequests[courseName] = reqs;
    });
    res.send(allRequests);
})

// input: request ID || or all request paramters ????
router.post('/acceptSlotLinking', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.MemberRank != "coordinator")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const coursesCoordinated = getCoursesCoordinated(department.courses, req.signedMember.memberID);

    const slotLinkingReq = await RequestModel.findOne({reqID: req.body.reqID});
    if(!slotLinkingReq)
    {
        res.status(404).send("No such request");
    }
    const course = coursesCoordinated.find(course => course.courseName == slotLinkingReq.slotCourse);
    if(!course)
    {
        res.status(401).send("Access Denied");
    }
    slotLinkingReq.status = "accepted";
    await slotLinkingReq.save();
    
    // // check the following or assume handled
    // if(TA.departmentName != departmentName)
    // {
    //     return res.status(406).send("Not accepted to assign an academic member from another department!");
    // }
    // if(!isTAOfCourse(course,TA.memberID))
    // {
    //     return res.status(406).send("Not accepted! This academic member is NOT from the course staff");
    // }
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == slotLinkingReq.slotID)
        {
            // // check the following or assume already handled
            // if(slot.assignedMemberID)
            // {
            //    return res.status(406).send("This slot is already assigned, you can delete its assigment first!");
            // }
            const TA = await MemberModel.findOne({memberID:slotLinkingReq.sender});
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: TA.memberID,
                assignedMemberName: TA.name
            };
            const tailoredSlot = {
                day:slot.day,
                time:slot.time,
                location:slot.location,
                courseName:course.courseName
            };
            // check if there are collisions in the member's schedule
            const collisionSlot = TA.schedule.find(slot => slot.day == tailoredSlot.day && slot.time == tailoredSlot.time)
            if(collisionSlot)
            {
                return res.status(406).send("This academic member has another course slot at this timing!");
            }
            TA.schedule.push(tailoredSlot);
            await TA.save();
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
})


// input: request ID || or all request paramters ????
router.post('/rejecttSlotLinking', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.MemberRank != "coordinator")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const coursesCoordinated = getCoursesCoordinated(department.courses, req.signedMember.memberID);

    const slotLinkingReq = await RequestModel.findOne({reqID: req.body.reqID});
    if(!slotLinkingReq)
    {
        res.status(404).send("No such request");
    }
    const course = coursesCoordinated.find(course => course.courseName == slotLinkingReq.slotCourse);
    if(!course)
    {
        res.status(401).send("Access Denied");
    }
    slotLinkingReq.status = "rejrcted";
    await slotLinkingReq.save();
    
})



// input: courseName && courseSlotInfo -- check collisions
router.post('/courseSlot', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.MemberRank != "coordinator")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const coursesCoordinated = getCoursesCoordinated(department.courses, req.signedMember.memberID);

    const course = coursesCoordinated.find(course => course.courseName == req.body.courseName);
    if(!course)
    {
        res.status(401).send("Access Denied");
    }
    
    const courseSlot = new  CourseSlotModel(req.body.courseSlot);
    // check if there are collisions in the member's schedule
    const collisionSlot = course.courseSchedule.find(slot => slot.day == courseSlot.day && slot.time == courseSlot.time && slot.location == courseSlot.location);
    if(collisionSlot)
    {
        return res.status(406).send("Alrady exist slot with these specifications!");
    }
    course.courseSchedule.push(courseSlot);
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
})


// input: courseName && courseSlotID -- check for existence
router.delete('/courseSlot', async (req,res)=>{
    // getting the member requesting this get from the data base by the token
    // and putting it in a variable  req.member using middleware
    if(req.signedMember.MemberRank != "coordinator")
    {
        return res.status(401).send("Access denied!");
    }
    const facultyName = req.signedMember.facultyName;
    const departmentName = req.signedMember.departmentName;
    const fac =await FacultyModel.findOne({facultyName: facultyName});
    const department = fac.departments.find(dep => dep.departmentName == departmentName);
    const coursesCoordinated = getCoursesCoordinated(department.courses, req.signedMember.memberID);

    const course = coursesCoordinated.find(course => course.courseName == req.body.courseName);
    if(!course)
    {
        res.status(401).send("Access Denied");
    }
    // // may skip the following    
    // const courseSlot = course.courseSchedule.find(slot => slot.slotID == req.body.slotID); // or use all slot Indo to escape from the ID issue that I think may face
    // if(!courseSlot)
    // {
    //     return res.status(404).send("Not found!");
    // }
    course.courseSchedule= course.courseSchedule.filter(slot => slot.slotID != req.body.slotID);;
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
})

module.exports=router;