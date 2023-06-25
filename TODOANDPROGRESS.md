# To do
- [Server] editors of the board can edit tasks for the Project
- [Server] Refactor common authorization validation (e.g. if they own the project/task) into a middleware instead of copy pasting throughout app
- [Server] Users can only own up to 2 boards if they are in free tier. Shared is not counted. 
- [Server] If premium user with >2 boards become free user, ensure board is locked and people can read only. Give ability to owner to choose which board to "lock" and which to be able to use if they dont want to go back to premium
- TBC... sometime in the future...
- [Server] Extend functionality Task entity to include custom tasks (i.e. custom columns)
- [Server] Enable choosing of either read only or view only for sharing
- Stripe for payments of premium tier
- Set up crypto payments for premium tier
- Add OAuth (Gmail only first) as authentication

# Done
- 16/06/23: Initialization of client and server app
- 20/06/23: [Server] Basic Create and read for just main Project (creating data in the project do later) with mongodb mongoose express node. Ensure correct folder structure (controllers, models, routes)
- 22/06/23: [Server] Basic CRUD functionalities for Project entity
- 22/06/23: [Server] Basic create and read for User entity
- 23/06/23: [Server] Extend functionality for User entity (e.g. password validation, sign up (create) , login (extension of get), etc...)
- 23/06/23: [Server] Added authorization for certain APIs. When user logs in, there will be a JWT token returned which must be used to for authorization for some APIs
- 23/06/23: [Server] Link project to users and ensure only the users can edit the project; Project should now have a owner field. Upon creating, link the email to the Project
- 23/06/23: [Server] CRUD Functionalities of Task entity and link it to the project (i.e. the columns and date for the "table")
- 24/06/23: [Server] Upon editing certain task (just nextAction for now) there should be a history of it.  
- 24/06/23: [Server] Add authorization for tasks and ensure only owner of the project can perform actions on the Task for the given Project
- 24/06/23: [Server] Enable "sharing" of projects. Hence, in Project Entity, add one more property: editors which is an array of the emails.
    - Only owners can share Project with people
    - editors can view the Project but cannot edit the Project (i.e. cant change project description/share,etc...)
- 25/06/23: [Server] Enable remove sharing of projects. Improved error handling for sharing to ensure input of email is an array of strings. Previously, if user sends as text, app will crash because it tries to loop on undefined. 