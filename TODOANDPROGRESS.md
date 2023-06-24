# To do
- [Server] Add authorization for tasks and ensure only owner of the project can perform actions on the Task for the given Project
- [Server] Enable "sharing" of projects. Either read only or edit permissions. Hence, in Project Entity, add 2 more properties which are basically arrays of email: readOnly & editors. Ensure readOnly can view only and cannot edit. editors can read and edit
- [Server] Users can only own up to 2 boards if they are in free tier. Shared is not counted. 
- [Server] If premium user with >2 boards become free user, ensure board is locked and people can read only. Give ability to owner to choose which board to "lock" and which to be able to use if they dont want to go back to premium
- TBC... sometime in the future...
- [Server] Extend functionality Task entity to include custom tasks (i.e. custom columns)
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
