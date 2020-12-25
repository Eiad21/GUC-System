const express = require('express');
app = express();
var HODroutes = require("./routes/HodRoutes")
var HRroutes = require("./routes/HRRoutes")
var AnyAcademic=require("./routes/AnyAcademic")
var instructorRoutes=require("./routes/InstructorRoutes")
var cooRoutes=require("./routes/CoordinatorRoutes")
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const memberRoutes=require('./routes/memberRoutes')
const Authroutes=require('./routes/AuthRoutes')
require('./automation/automatedfunction');

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use('',Authroutes);

app.use(async (req,res, next) =>{
    const token = req.headers.token;

    if(!token){
        return res.status(401).send("ya kalb");
    }
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
})

app.use("/Hod",HODroutes);
app.use("/hr",HRroutes);
app.use("/anyAcademic",AnyAcademic);
app.use("/memberRoutes",memberRoutes);
app.use("/instructorRoutes",instructorRoutes);
app.use("/cooRoutes",cooRoutes);

//database tables constructors:
// const Member=require('./models/memberSchema').constructor;
//const { member } = require('./models/memberSchema');
// const Course=require('./models/CourseSchema').constructor;
// const Department=require('./models/departmentSchema').constructor;
// const Faculty=require('./models/facultySchema').constructor;
// const Location=require('./models/locationSchema').constructor;
// const LogList=require('./models/logListSchema').constructor;
// const LogObject=require('./models/logObjectSchema').constructor;
// const Slot=require('./models/slotSchema').constructor;

 

// const connectionParams={
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// }

// // // const url="mongodb+srv://abdoolelcool:<password>@cluster0.vf8uu.mongodb.net/<dbname>?retryWrites=true&w=majority"
// // const url="mongodb+srv://sawan:7777777o@cluster0.d4j6s.mongodb.net/TheSawanDB?retryWrites=true&w=majority"
// const url='mongodb+srv://KimoBase:Kimo1234@cluster0.3eaqp.mongodb.net/GUCSys?retryWrites=true'


// mongoose.connect(url,connectionParams).then(()=>{
//     console.log("Database connected");
// }).catch(()=>{
//     console.log("error in database connection");
// }); 
 //app.use("/",routes)
 


//  const memberSchema = new Member({
//     name:"Kimo"
    
       
//     ,

//     memberId: 6
//     ,
    
//     Facultyname:"Pharmacy"
//     ,

//     department:"CS"
//   ,

//     email:"kofta222@yahoo.com",

//     password:"b555555",

//     schedule:[]
// });

// memberSchema.save();

 

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
app.listen(8080)
module.exports.app = app
//module.export = app;
