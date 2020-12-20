
const mongoose = require('mongoose');




// location schema
const loc=mongoose.Schema({
    locationName:{
        type:String,
        required:true
  },
    size:{
        type:Number,
        required:true
  },
  locationType:{
  
        type:String,
        required:true
  
  }
  }
  )




const Slot=mongoose.Schema(
 {   

    day:{type:String,
        required:true,
        },
    time:{type:String,
          required:true
         },
  //please take note that it may cause problem 34an naming  plus syntax
    location:loc,
    course:{type:String,
            required:true
  }

  }

  )

 const Slot_Schema= mongoose.model("Slot",Slot)
 const Location_Schema = mongoose.model("Location",loc)
  
  module.exports={SlotSchema:Slot_Schema , LocationSchema:Location_Schema}
