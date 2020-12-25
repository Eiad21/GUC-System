# GUC-System

## file to run the project and port listening

index .js port 8080

## functionalities description

### GUC Staff Members Functionalities


 * Functionality:Log in with a unique email and a password.
 * Route:AuthRoutes/logIn
 * Request type:post
 * Parameters:body{email,password}
 * Example of how to call the route:AuthRoutes/logIn
 * Example for response:password changed 
 
 * Functionality:Log out from the system.
 * Route:/logOut
 * Request type:get
 * Parameters:nothing
 * Example of how to call the route:memberRoutes/logOut
 * Example for response:done
 
 * Functionality:View their profile. Update their profile except for the id and the name. Academic members can’t update their salary, faculty and department. 
 * Route:/viewProfile
 * Request type:get
 * Parameters:nothing
 * Example of how to call the route:/memberRoutes/viewProfile
 * Example for response:user 
 
 * Functionality:Reset their passwords.
 * Route:/updatePassword
 * Request type:put
 * Parameters:body{old password, new password}
 * Example of how to call the route:/memberRoutes/updatePassword
 * Example for response:password changed 
 
 * Functionalities:Sign in. This should simulate a staff signing in(entering the campus).
 * Route:/signIn
 * Request type:post
 * Parameters:nothing
 * Example of how to call the route:memberRoutes/signIn
 * Example for response:json sign in session
 
 * Functionality:Sign out. This should simulate a staff signing out(leaving the campus).
 * Route:/signOut
 * Request type:post
 * Parameters:nothing
 * Example of how to call the route:memberRoutes/signOut
 * Example for response:done
 
 * Functionality:View all their attendance records, or they can specify exactly which month to view. 
 * Route:/viewAttendancee
 * Request type:get
 * Parameters:date
 * Example of how to call the route:memberRoutes/viewAttendancee
 * Example for response:json schedule 
 
 * Functionality:View if they have missing days. Missing days are days where the staff member don’t 
    have any attendance record, is not a Friday nor his/her day off, and there is no accepted leave for this day.  
 * Route:
 * Request type:
 * Parameters:
 * Example of how to call the route:memberRoutes/
 * Example for response:
 
 * Functionality: View if they are having missing hours or extra hours 
 * Route:/viewMembersMissingHoursAndExtraHours
 * Request type:post
 * Parameters:date
 * Example of how to call the route:memberRoutes/viewMembersMissingHoursAndExtraHours
 * Example for response:no missing hours 



### instructor functionalities

  
- Functionality: View the coverage of course(s) he/she is assigned to.
- Route: /InstructorRoutes/viewCoverages
- Request type: GET
- Parameters: nothing
- Example of how to call the route: /InstructorRoutes/viewCoverages
- Example for response:
  Functionality: get all coverages of all course(s)
  Route: /InstructorRoutes/viewCoverages
  Request type: GET
  Response: Array of coverages . Example of a single coverage: { “courseName” : coverage}

- Functionality: View the coverage of course(s) he/she is assigned to.
- Route: /InstructorRoutes/viewCoverages
- Request type: GET
- Parameters: nothing
- Example of how to call the route: /InstructorRoutes/viewCoverages
- Example for response:  
   Functionality: get all coverages of all course(s)  
   Route: /InstructorRoutes/viewCoverages \\
  Request type: GET <br />
  Response: Array of coverages . Example of a single coverage: { “courseName” : coverage}

### hr functionalities

- Functionality: add a location to the system
- Route: /hr/addLocation
- Request type: POST
- Request body: {“locationName” : “H12”, “capacity”: 100, “locationType”: “Lecture_Hall”}

- Functionality: update an existing location on the system
- Route: /hr/updateLocation
- Request type: POST
- Request body: {“locationNameOld” : “H12”, “locationNameNew” : “H13”, “capacity": 200}

- Functionality: delete an existing location on the system
- Route: /hr/deleteLocation
- Request type: POST
- Request body: {“locationName" : “H12”}

- Functionality: add a faculty to the system
- Route: /hr/addFaculty
- Request type: POST
- Request body: {“facultyName” : “Engineering", “deanID” : “ac-12”}

- Functionality: update an existing faculty on the system
- Route: /hr/updateFaculty
- Request type: POST
- Request body: {“facultyNameOld” : “Pharma", “facultyNameNew" : “Pharmacy", “deanID” : “ac-20”}

- Functionality: delete an existing faculty on the system
- Route: /hr/deleteFaculty
- Request type: POST
- Request body: {“facultyName” : “Medicine"}

- Functionality: add a department to the system
- Route: /hr/addDepartment
- Request type: POST
- Request body: {“facultyName” : “Engineering", “departmentName” : “MET", “headID” : “ac-12”}

- Functionality: update an existing department on the system
- Route: /hr/updateDepartment
- Request type: POST
- Request body: {“facultyName” : “Engineering", “departmentNameOld” : “MET", “departmentNameNew” : “Media Engineering & Technology", “headID” : “ac-12”}

- Functionality: delete an existing department on the system
- Route: /hr/deleteDepartment
- Request type: POST
- Request body: {“facultyName” : “Medicine", “departmentName” : “Oncology”}

- Functionality: add a course to the system
- Route: /hr/addCourse
- Request type: POST
- Request body: {“facultyName” : “Engineering", “departmentName” : “MET", “courseName” : “CSEN: 702”, “coverage” : 0.5, “coordinatorID” : “ac-19”}

- Functionality: update an existing course on the system
- Route: /hr/updateCourse
- Request type: POST
- Request body: {“facultyName” : “Engineering", “departmentName” : “MET", “courseNameOld” : “CSEN: 702”, “courseNameNew” : “CSEN: 702 Micro”, “coordinatorID : “ac-6”}

- Functionality: delete an existing course on the system
- Route: /hr/deleteCourse
- Request type: POST
- Request body: {“facultyName” : “Engineering", “departmentName” : “MET", “courseName” : “CSEN: 702”}

- Functionality: add a member to the system
- Route: /hr/addMember
- Request type: POST
- Request body: {“name” : “Amr ElMougy", “email” : “amr.elmougy@guc.edu.eg", “gender” : “M”, “MemberRank” : “instructor”}

- Functionality: add an existing member’s department
- Route: /hr/updateMemberDepartment
- Request type: POST
- Request body: {“memberId” : “ac-4", “facultyName” : “Engineering", “departmentName” : “MET”}

- Functionality: remove an existing member from a department
- Route: /hr/deleteMemberDepartment
- Request type: POST
- Request body: {“memberId” : “ac-4"}

- Functionality: Add a missing sign in record
- Route: /hr/addNewSignRecord
- Request type: POST
- Request body: {“memberId” : “ac-4", “date” : “2020-12-24T17:00:00.000+00:00”, “sessionId” : 3}

- Functionality: Add a missing sign in/out record
- Route: /hr/addNewSignRecord
- Request type: POST
- Request body: {“memberId” : “ac-4", “date” : “2020-12-24T17:00:00.000+00:00”, “signOut” : “2020-12-24T18:00:00.000+00:00”, “sessionId” : 3}

- Functionality: View attendance for a staff member
- Route: /hr/viewStaffAttendance
- Request type: POST
- Request body: {“memberId” : “ac-4"}

- Functionality: View attendance for a staff member
- Route: /hr/viewMembersMissingTime
- Request type: GET
- Request body: {}

- Functionality: Update salary for a staff member
- Route: /hr/updateMemberSalary
- Request type: POST
- Request body: {“memberId” : “ac-4", “salary” : 8000}
>>>>>>> fc95a6bf6df052bd4fc2aec56da15ddceda43808
