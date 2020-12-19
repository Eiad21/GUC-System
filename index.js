const mongoose = require('mongoose');
const app = require('./app').app;



const connectionParams={
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}

// const url="mongodb+srv://abdoolelcool:<password>@cluster0.vf8uu.mongodb.net/<dbname>?retryWrites=true&w=majority"
// const url="mongodb+srv://sawan:7777777o@cluster0.d4j6s.mongodb.net/TheSawanDB?retryWrites=true&w=majority"
// const url='mongodb+srv://KimoBase:Kimo1234@cluster0.3eaqp.mongodb.net/GUCSys?retryWrites=true'
const url='mongodb+srv://karimanga:123456abc@cluster0.ecodf.mongodb.net/guc?retryWrites=true'


mongoose.connect(url,connectionParams).then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("error in database connection");
}); 
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

//  loc1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})
//  slot1.save().then(()=>console.log("record added")).catch(err=>{console.log(err)})


