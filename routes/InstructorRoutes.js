const express = require("express")
const router = express.Router();
// const Location = require("../models/locationSchema").constructor
const FacultyModel = require("../models/facultySchema").constructor;
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


// waiting for kimOo to take code for the second functionality
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
    course.courseSchedule.forEach((slot,idx)=>{
        if(slot.slotID == req.body.slotID)
        {
            course.courseSchedule[idx]={
                slotID: slot.slotID,
                day: slot.day,
                time: slot.time,
                location: slot.location,
                assignedMemberID: req.body.assignedMemberID,
                assignedMemberName: req.body.assignedMemberID
            };
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
    
    Location.findOneAndUpdate(
        {locationName: req.body.locationNameOld},
        {
            locationName:req.body.locationNameNew,
            size:req.body.size,
            locationType:req.body.locationType
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