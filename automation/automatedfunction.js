const AttendanceModel = require("../models/attendanceSchema").constructor;
const requestModel = require("../models/requestSchema").requestModel;
const MemberModel = require("../models/memberSchema").constructor;
const signInSessionSchema = require("../models/signInSessionSchema").constructor

// function to add empty attendance record for all members every day

setInterval(async function() {
    let dateObj = new Date();

    let temp =new signInSessionSchema({timeout:dateObj 
    });

    let month = dateObj.getUTCMonth() ; //months from 1-12
    let day = dateObj.getUTCDate()+1;
    let year = dateObj.getUTCFullYear();
    let dateoz = new Date(year,month,day);

    const members = 
    await MemberModel.find({});


    for(i in members){
        const attendRecOld = await AttendanceModel.findOne({$and: [{memberId: members[i].memberId}, {date:dateoz}]});
        if(attendRecOld){
            console.log("continue")
        }
        else{
            const attendRecNew = new AttendanceModel({
                memberId:members[i].memberId,
                memberName:members[i].name,
                date:dateoz,
                missedDay:true
            })
            const leavingRequest = await requestModel.findOne({sender:attendRecNew.memberId,
                                                                        type:"leave",
                                                                        status:"accepted",
                                                                        leavingDate:dateoz});
            if(leavingRequest){
                attendRecNew.missedDay = false;
            }
            console.log(attendRecNew);
            await attendRecNew.save();
        }
    }
},86400000/*24 hours*/);

module.exports={}