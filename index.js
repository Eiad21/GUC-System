const mongoose = require('mongoose');
//const { slotSchema } = require('./models/slotSchema');
const app = require('./app').app;
const courseschema = require('./models/CourseSchema').constructor
const departmentSchema= require("./models/departmentSchema").constructor

const memberSchema = require('./models/memberSchema').constructor
const slotSchema = require('./models/slotSchema').constructor
//const authoController = require('./controllers/authoController').constructor

console.log("everything is working");
const connectionParams={
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}

// const url="mongodb+srv://abdoolelcool:<password>@cluster0.vf8uu.mongodb.net/<dbname>?retryWrites=true&w=majority"
//const url="mongodb+srv://sawan:7777777o@cluster0.d4j6s.mongodb.net/TheSawanDB?retryWrites=true&w=majority"
// const url='mongodb+srv://KimoBase:Kimo1234@cluster0.3eaqp.mongodb.net/GUCSys?retryWrites=true'
 const url='mongodb+srv://karimanga:123456abc@cluster0.ecodf.mongodb.net/guc?retryWrites=true'


mongoose.connect(url,connectionParams).then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("error in database connection");
}); 
/*

    let slot1=new slotSchema({
        day:"saturday",
        time:"3",
        location:"c4",
        courseName:"csen"
    });
    let member1=new memberSchema(
        {
            name:"abdullah",
            gender:"male",
            memberId:"14843",
            Facultyname:"engineering",
            department:"cs",
            email:"abdullahesham",
            password:"123",
            salary:1000,
            officeLocation:"c4",
            schedule:[slot1]
        } 
        );
        let member2=new memberSchema(
            {
                name="eiad",
                gender="male",
                memberId="10701",
                Facultyname="engineering",
                department="cs",
                password="123",
                salary=2000,
                officeLocation="c4",
                schedule=[new slotSchema({
                    day="saturday",
                    time="4",
                    location="c4",
                    courseName="csen"
                })]
            } 
            )

            let member3=new memberSchema(
                {
                    name="karim",
                    gender="male",
                    memberId="8922",
                    Facultyname="engineering",
                    department="cs",
                    password="123",
                    salary=3000,
                    officeLocation="c4",
                    schedule=[new slotSchema({
                        day="saturday",
                        time="5",
                        location="c4",
                        courseName="csen"
                    })]
                } 
                )
*/

//  member1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)});

 // slot1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)});

 // member2.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})
 // member3.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})


//  let loc1=new locationSchema
//  (
//     {
//         locationName:"H1",
//         size:20,
//         locationType:"Lectuer Hall"
//     }
// )


// let slot1=new SlotSchema
// (
//    {
//        day:"sunday",
//        time:"10 am",
//        location:loc1,
//        course:"CSEN501"
//    }
// )

// let member1 = new  memberSchema(
//     {name:"Kimo",
//     gender:"male",
//    memberId:6,
//    Facultyname:"Pharmacy",
//    department:"CS",
//    email:"kofta222@yahoo.com",
//    password:"b555555",
//    salary:1,
//     officeLocation:"c5",
//    schedule:[]
//    } 
//     )


//  let member2 = new  memberSchema(
//     {name:"Kimo",
//     gender:"male",
//    memberId:4,
//    Facultyname:"Pharmacy",
//    department:"CS",
//    email:"kofta22@yahoo.com",
//    password:"b555555",
//    salary:1,
//     officeLocation:"c5",
//    schedule:[]
//    } 
//     )

// let course1=new courseschema
// ( {courseName:"Csen502",
//   coverage:75,
  

//   coordiantorID:4,
//   coordinatorName:"Kimo",
//   instructors:[member1],
//   TAs:[member2],
//   courseSchedule:[]
// }
// )
 //course1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})



// const department1=new departmentSchema({
//     departmentName:"CS",
//     headID:1,
//     headName:"Kimo",
//     courses:[course1],
//     staff:[member2,member1]
//    });
//   department1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})
//  slot1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})


