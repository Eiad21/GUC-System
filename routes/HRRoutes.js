const express = require("express")
var router = express.Router();
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor
const Department = require("../models/departmentSchema").constructor
const Course = require("../models/CourseSchema").constructor


// HR Routes
// Location manipulation
router.post('/addLocation', async (req,res)=>{
    const location= await new Location({
        locationName:req.body.locationName,
        capacity:req.body.capacity,
        locationType:req.body.locationType
    });
    location.save().then((data)=>{
        res.send(data);
        console.log(data);
    }).catch((error)=>{
        res.json(error);
        console.log(error);
    });
})

router.post('/updateLocation', async (req,res)=>{
  
    Location.findOneAndUpdate(
        {locationName: req.body.locationNameOld},
        {
            locationName:req.body.locationNameNew,
            capacity:req.body.capacity,
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
            console.log('found fac');
            // Find the Department
            var index
            var flag = false;
            for(i in doc.departments){
                if(doc.departments[i].departmentName === req.body.departmentName){
                    flag = true;
                    console.log('found dep');
                    // Add the course
                    const course= await new Course({
                        courseName:req.body.courseName,
                        coverage:req.body.coverage,
                        coordiantorID:req.body.coordiantorID,
                        coordinatorName:req.body.coordiantorName
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
                res.send(doc);
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
                res.send();
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

module.exports=router;