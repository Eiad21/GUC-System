
const mongoose = require('mongoose');


const Slot=mongoose.Schema(
 {   

    day:{type:String,
        required:true,
        },
    time:{type:String,
          required:true
         },
  // please take note that it may cause problem 34an naming  plus syntax
    location:{type:loc,
            required:true
             },
    course:{type:String,
            required:true
  }

  }

  )


  module.exports=mongoose.model('Slot',Slot)