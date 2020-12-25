const mongoose = require('mongoose');


const courseSlotSchema=mongoose.Schema({   
    slotID:{
            type:String,
            required:true
    },
    day:{
        type:String, // not sure about the time
        required:true,
    },
    time:{
        type:Number, // 1 2 3 4 5
        required:true
         },
  // please take note that it may cause problem 34an naming  plus syntax
   location:{type:String,
           required:true
            },
    assignedMemberID:{type:String},

    assignedMemberName:{type:String}                
  }

  );
  
  module.exports.constructor = mongoose.model('courseSlot',courseSlotSchema);
  module.exports.courseSlotSchema = courseSlotSchema;