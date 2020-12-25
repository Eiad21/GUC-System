# GUC-System

## file to run the project and port listening

## functionalities description

### instructor functionalities

  
  * Functionality: View the coverage of course(s) he/she is assigned to.
  * Route: /InstructorRoutes/viewCoverages
  * Request type: GET
  * Parameters: nothing
  * Example of how to call the route: /InstructorRoutes/viewCoverages
  * Example for response:
        Functionality: get all coverages of all course(s)
        Route: /InstructorRoutes/viewCoverages
        Request type: GET
        Response: Array of coverages . Example of a single coverage: { “courseName” : coverage}