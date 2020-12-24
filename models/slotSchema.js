
const mongoose = require('mongoose');


const slotSchema=mongoose.Schema(
 {

    day:{type:String, // not sure about the type
        required:true,
        },
    time:{type:Number, // 1 2 3 4 5
          required:true
         },
   location:{type:String,
           required:true
            },
    courseName:{type:String,
            required:true
  }

  }

  )
  
  module.exports.constructor = mongoose.model('slot',slotSchema);
  module.exports.slotSchema = slotSchema