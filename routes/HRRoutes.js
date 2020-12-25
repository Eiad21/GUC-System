const express = require("express")
var router = express.Router();
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor
const Department = require("../models/departmentSchema").constructor
const Course = require("../models/CourseSchema").constructor
const Member = require("../models/memberSchema").constructor
const Attendance = require("../models/attendanceSchema").constructor
const Session = require("../models/signInSessionSchema").constructor

// HR Routes
// Location manipulation
router.post('/addLocation', async (req,res)=>{
    // if(!req.signedMember || req.signedMember.MemberRank != "hr"){
    //     return res.status(401).send("Access denied!");
    // }
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
    if(!req.signedMember || req.signedMember.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    Location.findOneAndUpdate(
        {locationName: req.body.locationNameOld})
        
        .then((doc) => {
            if(!doc){
                return res.status(404).send("Not found");
            }
            if(locationNameNew){
                doc.locationName = req.body.locationNameNew;
            }
            if(capacity){
                doc.capacity = req.body.capacity;
            }
            if(locationType){
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
    // if(!req.signedMember || req.signedMember.MemberRank != "hr"){
    //     return res.status(401).send("Access denied!");
    // }
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
router.post('/addFaculty', async (req,res)=>{
    if(!req.signedMember || req.signedMember.MemberRank != "hr"){
        return res.status(401).send("Access denied!");
    }
    const faculty= await new Faculty({
        facultyName:req.body.facultyName,
        deanID:req.body.deanID,
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
            if(doc){
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
                    }

                    // TODO: Valide id and name
                    doc.departments[i].headID = req.body.headID;
                    doc.departments[i].headName = req.body.headName;
                    
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
router.post('/addCourse', async (req,res)=>{
    
    // Find the Faculty
    Faculty.findOne(
        {facultyName: req.body.facultyName})
             
        .then(async (doc) => {
            // Find the Department
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    flag = true;
                    // Add the course
                    const course= await new Course({
                        courseName:req.body.courseName,
                        coverage:req.body.coverage,
                        coordinatorID:req.body.coordinatorID,
                        coordinatorName:req.body.coordinatorName
                    });

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
                            doc.departments[i].courses[j].courseName = req.body.courseNameNew
                            doc.departments[i].courses[j].coverage = req.body.coverage
                            doc.departments[i].courses[j].coordiantorID = req.body.coordiantorID
                            doc.departments[i].courses[j].coordinatorName = req.body.coordinatorName
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
router.post('/addMember', async (req,res)=>{
    const member = await new Member({
        name:req.body.name,
        gender:req.body.gender,
        memberId:req.body.memberId,
        email:req.body.email,
        password:"123456"
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
    if(!req.body.memberId){
        // bad request
    }
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
                    
                     // Add to new Fac and Dep
                     Faculty.findOne({
                        facultyName:mem.FacultyName
                    })
                    .then((doc) =>{

                        const values = {id: mem.memberId, name: mem.name, mail: mem.email, office: mem.officeLocation}
                    
                        const depNew = doc.departments.find(item => {
                            return item.departmentName === req.body.departmentName;
                        })

                     depNew.staff.push(values);
                    
                     doc.save();
                     
                     res.statusCode = 200;
                     res.send();

                    })
                    .catch((error)=>{
                        console.log(error)
                        res.send(error);
                    })
                     
    
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
    if(!req.body.memberId){
        //bad req
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
    // if(!req.signedMember || req.signedMember.MemberRank != "hr"){
    //     return res.status(401).send("Access denied!");
    // }
    if(req.body.date){
        Attendance.findOne({date:req.body.date, memberId:req.body.memberId})
        .then((doc) =>{
            if(!doc){
                return res.status(404).send("Not found");
            }
            if(!req.body.sessionId){
                return res.status(400).send("Bad request");
            }
            else{
                const session = doc.sessions[req.body.sessionId-1];
                if(req.body.signOut && !session.timeout){
                    session.timeout = req.body.signOut;
                }
                else if(req.body.signIn && !session.timein){
                    session.timein = req.body.signIn;
                }
                else{
                    res.status(404).send("Not found");
                }

                doc.missingMinutes -= (session.timeout.getTime() - session.timein.getTime()) / (1000 * 60);

                doc.save();
            }
        })
        .catch((err) =>{
            console.log(err);
            res.send(err);
        })
        
    }
    else{
        res.status(400).send("Bad request");
    }
})

router.post('/viewStaffAttendance', async (req,res)=>{
    
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

router.post('/viewMembersMissingTime', async (req,res)=>{
    //const loc = await Location.find({locationType:"Office"},{locationName:1, _id:0}).distinct('locationName');
    //const loc = await Location.find({$and: [{capacity: {$gt: 5}}, {population: 0}]});
    const membersIDsMissingTime = 
        await Attendance.find( {$or: [{missedDay: true}, {missingMinutes: {$gt: 0}}]} ,{memberId:1, _id:0}).distinct('memberId');
    
    const membersMissingTime = await Member.find({memberId: {$in:membersIDsMissingTime}})

    console.log(membersMissingTime);
    res.send(membersMissingTime);
})

router.post('/updateMemberSalary', async (req,res)=>{

    Member.findOne(
        {memberId:req.body.memberId})
    .then((doc) =>{
        if(doc){
            if(!req.body.salary){
                //bad request
            }
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
    })
    .catch((err) => {
        console.error(err);
        res.send(err)
    }
    );
})

module.exports=router;