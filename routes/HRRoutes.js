const express = require("express")
var router = express.Router();
const Location = require("../models/locationSchema").constructor
const Faculty = require("../models/facultySchema").constructor


// HR Routes
// Location manipulation
router.post('/addLocation', async (req,res)=>{
    const location= await new Location({
        locationName:req.body.locationName,
        size:req.body.size,
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
  
    Faculty.findOneAndUpdate(
        {facultyName: req.body.facultyNameOld},
        {
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
    
    Faculty.findOne(
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
})

module.exports=router;