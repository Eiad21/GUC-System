const express = require("express")
var router = express.Router();
const Location = require("../models/locationSchema").constructor

// HR Routes
router.post('/addLoc', async (req,res)=>{
    const location= await new Location({
        locationName:req.body.locationName,
        size:req.body.size,
        locationType:req.body.locationType
    });
    console.log('test');
    await location.save().then((data)=>{
        res.send(data);
        console.log(data);
    }).catch((error)=>{
        res.json(error);
        console.log(error);
    });
})

router.post('/hr/updateLoc', async (req,res)=>{
  
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

router.post('/hr/deleteLoc', async (req,res)=>{
  
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

module.exports=router;