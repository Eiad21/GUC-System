const express = require("express")
var router = express.Router();
const bcrypt = require("bcrypt")
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor
const Department = require("../models/departmentSchema").constructor
const Course = require("../models/CourseSchema").constructor
const Member = require("../models/memberSchema").constructor
const Attendance = require("../models/attendanceSchema").constructor
const Counter = require("../models/counterSchema").constructor
const Session = require("../models/signInSessionSchema").constructor
require('dotenv').config()
const jwt=require('jsonwebtoken');


// HR Routes
function authenticate(req){
    const token = req.body.token;
    console.log("token")
    console.log(token)
    console.log(req.body)
    console.log(req.params)
    if(!token){
        return false;
    }
    else{
        return jwt.verify(token, process.env.TOKEN_SECRET);
    }
}

// Location manipulation

router.post('/viewAllLocations', async (req, res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const locs = await Location.find();
    res.send(locs);
    console.log(locs);
})
router.post('/addLocation', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
         return res.status(401).send("Access denied!");
    }
    var location;
    if(req.body.locationType === "Office"){
        location = await new Location({
            locationName:req.body.locationName,
            capacity:req.body.capacity,
            population:0,
            locationType:req.body.locationType
        });
    }
    else{
        location = await new Location({
            locationName:req.body.locationName,
            capacity:req.body.capacity,
            locationType:req.body.locationType
        });
    }
    
    location.save().then((data)=>{
        res.send(data);
        console.log(data);
    }).catch((error)=>{
        res.json(error);
        console.log(error);
    });
})

router.post('/updateLocation', async (req,res)=>{
    console.log("a7mad")
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
   }
    Location.findOneAndUpdate(
        {locationName: req.body.locationNameOld})
        
        .then((doc) => {
            if(!doc){
                return res.status(404).send("Not found");
            }
            if(req.body.locationNameNew){
                doc.locationName = req.body.locationNameNew;
            }
            if(req.body.capacity){
                doc.capacity = req.body.capacity;
            }
            if(req.body.locationType){
                doc.locationType = req.body.locationType;
            }
            doc.save();
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
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    Location.findOneAndDelete(
        {locationName: req.body.locationName})
             
        .then((doc) => {
            if(!doc){
                return res.status(404).send("Not found");
            }
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
router.post('/viewAllFaculties', async (req, res)=>{
    console.log(req.user)
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const facs = await Faculty.find();
    res.send(facs);
    console.log(facs);
})
router.post('/addFaculty', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const faculty= await new Faculty({
        facultyName:req.body.facultyName,
        deanID:req.body.deanID,
        deanName:req.body.deanName
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
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    // Find and update Faculty on facultyName
    Faculty.findOne(
        {facultyName: req.body.facultyNameOld}
        // {
        //     // For values you don't wish to change enter the old value
        //     facultyName:req.body.facultyNameNew,
        //     deanID:req.body.deanID
        // },
        // { new: true },
        )
        
        .then((doc) => {
            if(req.body.facultyNameNew){
                doc.facultyName = req.body.facultyNameNew
            }
            if(req.body.deanID){
                doc.deanID = req.body.deanID
            }
            if(req.body.deanName){
                doc.deanName = req.body.deanName
            }
            doc.save();
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
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
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
router.post('/viewAllDepartments', async (req, res)=>{
    console.log(req.user)
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const facs = await Faculty.find();
    let arr = []
    for(i in facs){
        let deps = facs[i].departments;
        arr = arr.concat(deps);
    }
    res.send(arr);
    console.log(arr);
})

router.post('/addDepartment', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            if(doc){
                // Create Department
            const department= await new Department({
                departmentName:req.body.departmentName,
                facultyName: req.body.facultyName,
                headID:req.body.headID,
                // get automatically
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
        }
        else{
            res.statusCode = 404;
            res.send();
        }

          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/updateDepartment', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
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
                    if(req.body.departmentNameNew){
                        doc.departments[i].departmentName = req.body.departmentNameNew;
                        for(j in doc.departments[i].courses){
                            doc.departments[i].courses[j].departmentName = req.body.departmentNameNew;
                        }
                    }

                    // TODO: Valide id and name
                    if(req.body.headID){
                        doc.departments[i].headID = req.body.headID;
                    }
                    if(req.body.headName){
                        doc.departments[i].headName = req.body.headName;    
                    }
                    // Save department with updated values
                    doc.save().then((doc) => {
                        console.log(doc);
                        res.send(doc)
                      })
                      .catch((err) => {
                          console.error(err);
                          res.send(err)
                    }
                );
                    break;
                }
            }
            if(!flag){
                res.statusCode = 404;
                res.send();
            }
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/deleteDepartment', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
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

// Course within Department within Faculty manipulation
router.post('/viewAllCourses', async (req, res)=>{
    console.log(req.user)
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const facs = await Faculty.find();
    let arr = []
    for(i in facs){
        let deps = facs[i].departments;
        for(j in deps){
            let courses = deps[i].courses;
            arr = arr.concat(courses);
        }
    }
    res.send(arr);
    console.log(arr);
})
router.post('/addCourse', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            if(!doc){
                res.statusCode = 404;
                res.send();
            }
            // Found the Department
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    flag = true;
                    // Add the course
                    const course= await new Course({
                        courseName:req.body.courseName,
                        facultyName: req.body.facultyName,
                        departmentName: req.body.departmentName,
                        assignedCount:0,
                        coverage:0,
                        coordinatorID:req.body.coordinatorID,
                        // get auto
                        coordinatorName:req.body.coordinatorName
                    });

                    console.log(course)

                    doc.departments[i].courses.push(course);
                    
                    // Save department with updated values
                    await doc.save();
                    res.send(course);
                    break;
                }
            }
            if(!flag){
                res.statusCode = 404;
                res.send();
            }
          })
          .catch((err) => {
              console.error("err");
              res.send(err)
        }
    );
})

router.post('/updateCourse', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Find the Department
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    console.log("Found DEP");
                    // Found the Department
                    
                    // Find the Course
                    for(j in doc.departments[i].courses){
                        console.log(doc.departments[i].courses[j].courseName + "and" + req.body.courseNameOld);
                        if(doc.departments[i].courses[j].courseName === req.body.courseNameOld){
                            console.log("Found Course")
                            flag = true;
                            if(req.body.courseNameNew){
                                doc.departments[i].courses[j].courseName = req.body.courseNameNew
                            }
                            // doc.departments[i].courses[j].coverage = req.body.coverage
                            if(req.body.coordiantorID){
                                doc.departments[i].courses[j].coordiantorID = req.body.coordiantorID
                            }
                            if(req.body.coordinatorName){
                                doc.departments[i].courses[j].coordinatorName = req.body.coordinatorName
                            }
                            //TEST THIS METHOD
                        }
                    }

                    break;
                }
            }
            if(!flag){
                res.statusCode = 404;
                res.send();
            }
            else{
                // Save department with updated values
                doc.save();
                console.log(doc);
                res.send();
            }
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/deleteCourse', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Find the Department
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    console.log("Found DEP");
                    // Found the Department
                    
                    // Find the Course
                    for(j in doc.departments[i].courses){
                        console.log(doc.departments[i].courses[j].courseName + "and" + req.body.courseName);
                        if(doc.departments[i].courses[j].courseName === req.body.courseName){
                            console.log("Found Course")
                            flag = true;
                            
                            doc.departments[i].courses.splice(j, 1);

                            //TEST THIS METHOD
                        }
                    }

                    break;
                }
            }
            if(!flag){
                res.statusCode = 404;
                res.send("Eiad gamed aktr mn omar");
            }
            else{
                // Save department with updated values
                doc.save();
                console.log(doc);
                res.send(doc);
            }
          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

// Member manipulation
router.post('/viewAllMembers', async (req, res)=>{
    console.log(req.user)
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const users = await Member.find({ email: { $ne: req.user.email } });
    res.send(users);
    console.log(users);
})
router.post('/addMember', async (req,res)=>{
    console.log(0);
    console.log(req.user.MemberRank)
    console.log(req.user)
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    if(!req.body.MemberRank){
        console.log("2")

        return res.status(400).send("Member rank must be specified");
    }
    if(!req.body.email){
        console.log("3")
        return res.status(400).send("Member email must be specified");
    }
    if(!req.body.name){
        console.log("4")

        return res.status(400).send("Member name must be specified");
    }
    if(!req.body.gender){
        console.log("5")

        return res.status(400).send("Member gender must be specified");
    }
    if(!req.body.salary){
        console.log("6")

        return res.status(400).send("Member salary must be specified");
    }
    const user = await Member.findOne({email:req.body.email});
    if(user){
        console.log("7")

        return res.status(401).send("Member already exists");
    }

    var prefix;
    if(req.body.MemberRank === "hr"){
        prefix = "hr-"
    }
    else{
        prefix = "ac-"
    }
    const num = await Counter.findOne({counterName:prefix});
    if(!num){
        const count = await new Counter({
            counterName:prefix,
            counterCount:1
        });
        prefix+="1";
        await count.save();
    }
    else{
        num.counterCount = num.counterCount+1;
        prefix = prefix+num.counterCount;
        await num.save();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash("123456", salt);
    console.log(prefix);
    const member = await new Member({
         name:req.body.name,
         gender:req.body.gender,
         memberId:prefix,
         email:req.body.email,
         password:hashedPass,
         salary:req.body.salary,
         MemberRank:req.body.MemberRank,
         officeLocation:req.body.office
     });

    member.save().then((data)=>{
         res.send(data);
         console.log(data);
     }).catch((error)=>{
         res.json(error);
         console.log(error);
     });
})

router.post('/updateMemberDepartment', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }

    if(!req.body.memberId || !req.body.facultyName || !req.body.departmentName){
        return res.status(400).send("You need to specify ID, faculty name, and department name");
    }

        // Add to new Fac and Dep
        await Faculty.findOne({
        facultyName:req.body.facultyName
        })
        .then((doc) =>{
            if(!doc){
                // not found
            }

            const values = {id: mem.memberId, name: mem.name, mail: mem.email, office: mem.officeLocation}
            const depNew = doc.departments.find(item => {
                return item.departmentName === req.body.departmentName;
            })

            if(!depNew){
                // not found
            }

            depNew.staff.push(values);
        
            doc.save();
            
            res.statusCode = 200;
            res.send();

        })
        .catch((error)=>{
            console.log(error)
            res.send(error);
        })
    
    // Find the member
    Member.findOne(
        {memberId: req.body.memberId})
        
        .then(async (doc) => {
            if(doc){
                
                const mem = doc;
    
                // Find the member's faculty
                await Faculty.findOne({
                    facultyName:mem.FacultyName
                })
                .then(async (doc) =>{
    
    
                    if(doc){

                        // Find the member's department
                        const dep = doc.departments.find(item => {
                            return item.departmentName === mem.departmentName;
                         })
                         if(dep){
                             console.log("old dep staff \n" + dep.staff);
                            // Remove member from department staff
                            dep.staff = await dep.staff.filter(item =>{
                                return item.mail != mem.email
                            })
                            console.log("new dep staff \n" + dep.staff)
        
                            // Remove member from course TAs & Instructor if exists in either one
                            for(i in dep.coures){
                                dep.courses[i].instructors.filter(item =>{
                                    return item.mail != mem.email
                                })
                                dep.courses[i].TAs.filter(item =>{
                                    return item.mail != mem.email
                                })
                            }
                            // Save changes to old Fac
                            doc.save();
                         }
                    }
    
                })
                //console.log(doc);

                // Edit Member attributes
                mem.FacultyName = req.body.facultyName;
                mem.departmentName = req.body.departmentName;
                // Save Member
                mem.save();

            }

          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/deleteMemberDepartment', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    if(!req.body.memberId){
        return res.status(400).send("Missing member ID");
    }
    // Find the member
    Member.findOneAndDelete(
        {memberId: req.body.memberId})
        
        .then(async (doc) => {
            if(doc){
                const mem = doc;
    
                // Find the member's faculty
                await Faculty.findOne({
                    facultyName:mem.FacultyName
                })
                .then(async (doc) =>{
    
    
                    if(doc){

                        // Find the member's department
                        const dep = doc.departments.find(item => {
                            return item.departmentName === mem.departmentName;
                         })
                         if(dep){
                             console.log("old dep staff \n" + dep.staff);
                            // Remove member from department staff
                            dep.staff = await dep.staff.filter(item =>{
                                return item.mail != mem.email
                            })
                            console.log("new dep staff \n" + dep.staff)
        
                            // Remove member from course TAs & Instructor if exists in either one
                            for(i in dep.coures){
                                dep.courses[i].instructors.filter(item =>{
                                    return item.mail != mem.email
                                })
                                dep.courses[i].TAs.filter(item =>{
                                    return item.mail != mem.email
                                })
                            }
                            // Save changes to old Fac
                            doc.save();
                            res.statusCode = 200;
                            res.send();
                         }
                    }
                    
                     
    
                })
                //console.log(doc);

                // // Edit Member attributes
                // mem.FacultyName = req.body.facultyName;
                // mem.departmentName = req.body.departmentName;
                // // Save Member
                // mem.save();

            }

          })
          .catch((err) => {
              console.error(err);
              res.send(err)
        }
    );
})

router.post('/addNewSignRecord', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    if(req.body.date){
        Attendance.findOne({date:req.body.date, memberId:req.body.memberId})
        .then((doc) =>{
            if(!doc){
                console.log("DIDNT FIND ATTENDANCE")
                return res.status(404).send("Not found");
            }
            if(!req.body.sessionId){
                return res.status(400).send("Bad request");
            }
            else{
                const session = doc.sessions[req.body.sessionId-1];
                console.log(req.body.signOut)
                console.log(session.timeout)
                if(req.body.signOut && !session.timeout){
                    session.timeout = req.body.signOut;
                }
                else if(req.body.signIn && !session.timein){
                    session.timein = req.body.signIn;
                }
                else{
                    console.log("Oh")
                    return res.status(400).send("Not found");
                }

                doc.missingMinutes -= (session.timeout.getTime() - session.timein.getTime()) / (1000 * 60);

                doc.save();
                return res.status(200).send("Good");
            }
        })
        .catch((err) =>{
            console.log(err);
            res.send(err);
        })
        
    }
    else{
        return res.status(400).send("Bad request");
    }
})

router.post('/viewStaffAttendance', async (req,res)=>{
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    Attendance.find(
        {memberId:req.body.memberId}
    )
    .then((doc) =>{
        if(!doc){
            return res.status(400).send("Not found!");
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

router.post('/viewMembersMissingTime', async (req,res)=>{
    //const loc = await Location.find({locationType:"Office"},{locationName:1, _id:0}).distinct('locationName');
    //const loc = await Location.find({$and: [{capacity: {$gt: 5}}, {population: 0}]});
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    console.log(req.body.date)
    const membersIDsMissingTime = 
        await Attendance.find({$and: [{date:req.body.date},{$or: [{missedDay: true}, {missingMinutes: {$gt: 0}}]}]} ,{memberId:1, _id:0}).distinct('memberId');
    
    console.log(membersIDsMissingTime)
    const membersMissingTime = await Member.find({memberId: {$in:membersIDsMissingTime}})

    res.send(membersMissingTime);
})

router.post('/updateMemberSalary', async (req,res)=>{
    console.log("Backend salary")
    if(req.user.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    if(!req.body.memberId){
        console.log("no id")
        return res.status(400).send("Bad request");
    }
    if(!req.body.salary){
        console.log("no salary")
        return res.status(400).send("Bad request");
    }
    if(req.body.memberId === req.user.memberId){
        return res.status(401).send("Access denied!");
    }
    console.log(req.body.memberId)
    Member.findOne(
        {memberId:req.body.memberId})
    .then((doc) =>{
        if(doc){
            doc.salary = req.body.salary;
            doc.save()
            .then((doc) =>{
                console.error(doc);
                res.send(doc)
            })
            .catch((err) => {
                console.error(err);
                res.send(err)
            });
        }
        else{
            res.status(404).send("Not found");
        }
    })
    .catch((err) => {
        console.error(err);
        res.send(err)
    }
    );
})

module.exports=router;