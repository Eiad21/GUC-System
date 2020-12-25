const AttendanceModel = require("../models/attendanceSchema").constructor;
const RequestModel = require("../models/requestSchema").constructor;
const MemberModel = require("../models/memberSchema").constructor;
const signInSessionSchema = require("../models/signInSessionSchema").constructor
const computeMissingMinutes = function(sessions){
    let accMiliseconds = 0;
    sessions.forEach(log=>{
        if(log.timein && log.timeout && log.timein < log.timeout)
        {
            //date.getTime() === date.valueOf() === (0 + date) === (+date)
            accMiliseconds = accMiliseconds + (log.timeout - log.timein);
        }
    });
    let accMinutes = accMiliseconds / (60000);
    return 504 - accMinutes;
};

// function to compute the missing hours/whether a missed day -- every day for each member
setInterval(async function() {
    // a = new Date(1999,0,30); // 0 is january
    // b = new Date(1999,0,30);

    // a.getTime() === b.getTime() // prints true

    let dateNow = new Date();
    dateNow = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate());
    
    // Getting the date of today
    const allAttendanceRecords = await AttendanceModel.find({date:dateNow.getTime()});

    //should I call .array first
    allAttendanceRecords.forEach(async attRecord => {
        // update the missing/extra hours and the missedDay attributes for this attendance record
        // so check if there is an acceptes leave request for this day
        const leavingRequests = await RequestModel.find({sender:attRecord.memberId,
                                                            type:"leave",
                                                            status:"accepted",
                                                            leavingDate:dateNow.getTime()});

        if(leavingRequests.length == 0) // no accepted leave request
        {
            const missingMinutes = computeMissingMinutes(attRecord.sessions);
            if(missingMinutes == 504)
            {
                // this means that it is a missed day
                attRecord.missingMinutes = 0
                attRecord.missedDay = true
            }
            else
            {
                attRecord.missingMinutes = missingMinutes
                attRecord.missedDay = false;
            }
        }
        else
        {
            attRecord.missingMinutes = 0
            attRecord.missedDay = false;
        }
        
    });    
    
},86400000/*24 hours*/ );




// function to compute the missing hours/ missing days -- every month to compute the paid salary for each member
setInterval(async function() {
    // a = new Date(1999,0,30); // 0 is january
    // b = new Date(1999,0,30);

    // a.getTime() === b.getTime() // prints true

    let dateNow = new Date();
    let currMonth = dateNow.getMonth(); // 0 based month

    const allMembers = await MemberModel.find({});
    
    allMembers.forEach(async (mem) => {
        const memAttRecords = await AttendanceModel.find({memberId: mem.memberID}).filter(
            attRec => attRec.date.getMonth() == currMonth
        );

        let missingMinutes = 0;
        let missingDays= 0;
        
        memAttRecords.forEach(record =>{
            missingMinutes = missingMinutes + record.missingMinutes;
            if(record.missedDay)
            {
                missingDays= missingDays + 1;
            }
        })
        // salary computation
        // update salary
    });

    // Getting the date of today
    const allAttendanceRecords = await AttendanceModel.find({date:dateNow.getTime()});

    //should I call .array first
    allAttendanceRecords.forEach(async (attRecord) => {
        // update the missing/extra hours and the missedDay attributes for this attendance record
        // so check if there is an acceptes leave request for this day
        const leavingRequests = await requestModel.find({sender:attRecord.memberId,
                                                            type:"leave",
                                                            status:"accepted",
                                                            leavingDate:dateNow.getTime()});

        if(leavingRequests.length == 0) // no accepted leave request
        {
            const missingMinutes = computeMissingMinutes(attRecord.sessions);
            if(missingMinutes == 504)
            {
                // this means that it is a missed day
                attRecord.missingMinutes = 0
                attRecord.missedDay = true
            }
            else
            {
                attRecord.missingMinutes = missingMinutes
                attRecord.missedDay = false;
            }
        }
        else
        {
            attRecord.missingMinutes = 0
            attRecord.missedDay = false;
        }
        
    });    
    
},86400000*30 );

// setInterval(async function() {
//     await console.log("bye1");
//     await console.log("bye2"); 
// },1000 );



// function to add empty attendance record for all members every day

// function to add empty attendance record for all members every day

setInterval(async function() {
    let dateObj = new Date();

    let temp =new signInSessionSchema({timeout:dateObj 
    });

    let month = dateObj.getUTCMonth() ; //months from 1-12
    let day = dateObj.getUTCDate()+1;
    let year = dateObj.getUTCFullYear();
    let dateoz = new Date(year,month,day);

    const membersIDs = 
    await MemberModel.find({} ,{memberId:1, _id:0}).distinct('memberId');


    for(i in membersIDs){
        const attendRecOld = await AttendanceModel.findOne({$and: [{memberId: membersIDs[i]}, {date:dateoz}]});
        if(attendRecOld){
            console.log("continue")
        }
        else{
            console.log(membersIDs[i])
            const attendRecNew = new AttendanceModel({
                memberId:membersIDs[i],
                date:dateoz,
                missedDay:true
            })

            console.log(attendRecNew);
            await attendRecNew.save();
        }
    }
},86400000/*24 hours*/);

module.exports={}