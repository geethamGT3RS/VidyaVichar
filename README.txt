Assumptions : 
    1. The Questions DB is live and relevant for only a term. The data will be refreshed at the end of the term.
    2. Users will be signing in with their institute email ID and map their name to the email ID in the signup form. 
    3. Admin user provided will upload the mapping of a Course to Instructor to TA to Students before any other users sign in. 
    4. --->>>> Does the Admin provide the user data also ??? (to be used at the time of sign in) ????? 
    5. The email ID is a unique identifier and a user can have 1 role only (You cannot be a TA and student with the same email ID at the same time)
    
How Things are working
1. In the Admin console
    1. For uploading the course mapping : 
        1. Initial Creation : The Admin ID will upload a CSV file with the below format for creating the course and adding instructors to it
            <course name>,<course description>,<instructor email>
        2. In case of update required for adding an instructor, a row in the same format needs to be uploaded. 
    2. For adding TA to a course
        1. Initial Creation : The Admin ID will upload a CSV file with the below format for adding TAs to it
            <course name>,<TA email>
        2. In case of update required for adding an TA to the course, a row in the same format needs to be uploaded. 
    3. For adding Students to a course
        2. For adding TA to a course
        1. Initial Creation : The Admin ID will upload a CSV file with the below format for adding students to it
            <course name>,<Student email>
        2. In case of update required for adding an TA to the course, a row in the same format needs to be uploaded. 
    4. There is no way to modify or delete a mapping thats already added right now.

2. Signup for the portal
    1. Signup authentication as well password management is through an OTP to the provided email address.
    2. On signup, user needs to provide the name (display name) and choose the role in the app (between instructor, TA and student). This is being done to reduce the implementation complexity at the moment. 
    3. The emails with the signup should match the emails that the admin has uploaded for the in the course maps for the user to be able to see data.
3. Student View
    1. 
    2.
    3.
4. Instructor View
    1.
    2.
    3.
5. TA View
    1.
    2.
    3.