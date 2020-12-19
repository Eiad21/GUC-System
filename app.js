const express = require('express');
app = express();

const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//database tables:
const Member=require('./models/memberSchema');
const Course=require('./models/CourseSchema');
const Department=require('./models/departmentSchema');
const Faculty=require('./models/facultySchema');
const Location=require('./models/locationSchema');
const LogList=require('./models/logListSchema');
const LogObject=require('./models/logObjectSchema');
const Slot=require('./models/slotSchema');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const connectionParams={
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}

const url="mongodb+srv://abdoolelcool:<password>@cluster0.vf8uu.mongodb.net/<dbname>?retryWrites=true&w=majority"


mongoose.connect(url,connectionParams).then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("error in database connection");
}); 

module.exports.app = app
//module.export = app;
