const AttendanceModel = require("../models/attendanceSchema").constructor;
const RequestModel = require("../models/requestSchema").constructor;


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
setInterval(function() {
    // a = new Date(1999,0,30); // 0 is january
    // b = new Date(1999,0,30);

    // a.getTime() === b.getTime() // prints true

    let dateNow = new Date();
    dateNow = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate());
    
    // Getting the date of today
    const allAttendanceRecords = await AttendanceModel.findMany({date:dateNow.getTime()});

    //should I call .array first
    allAttendanceRecords.array.forEach(attRecord => {
        // update the missing/extra hours and the missedDay attributes for this attendance record
        // so check if there is an acceptes leave request for this day
        const leavingRequests = await requestModel.findMany({sender:attRecord.memberId,
                                                            type:"leave",
                                                            status:"accepted",
                                                            leavingDate:dateNow.getTime()});

        if(leavingRequests.array.length == 0) // no accepted leave request
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

setInterval(async function() {
    await console.log("bye1");
    await console.log("bye2"); 
},1000 );

module.exports={}


