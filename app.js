const express = require('express');
app = express();

// const mongoose=require('mongoose');
// const bcrypt=require('bcryptjs');
// const jwt=require('jsonwebtoken');

// //database tables constructors:
// const Member=require('./models/memberSchema').constructor;
// const Course=require('./models/CourseSchema').constructor;
// const Department=require('./models/departmentSchema').constructor;
// const Faculty=require('./models/facultySchema').constructor;
// const Location=require('./models/locationSchema').constructor;
// const LogList=require('./models/logListSchema').constructor;
// const LogObject=require('./models/logObjectSchema').constructor;
// const Slot=require('./models/slotSchema').constructor;

// app.use(express.json());
// app.use(express.urlencoded({extended:false}));

// const connectionParams={
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// }

// // const url="mongodb+srv://abdoolelcool:<password>@cluster0.vf8uu.mongodb.net/<dbname>?retryWrites=true&w=majority"
// const url="mongodb+srv://sawan:7777777o@cluster0.d4j6s.mongodb.net/TheSawanDB?retryWrites=true&w=majority"


// mongoose.connect(url,connectionParams).then(()=>{
//     console.log("Database connected");
// }).catch(()=>{
//     console.log("error in database connection");
// }); 

// app.post('/schedule',(req,res)=>{
//     const location=new Location({
//         locationName:"C7",
//             size:40,
//             locationType:"exams"
//     })
//     const slot=new Slot({
//         day:req.body.day,
//         time:req.body.time,
//          location:location,
//         course:req.body.course
//     })
//     slot.save().then((data)=>{
//         res.json(data);
//     }).catch((error)=>{
//         res.json(error);
//     });
// })

// app.get('/schedule',(req,res)=>{
    
// })

module.exports.app = app
//module.export = app;
