# To do
- [Server] Work on Task entity and link it to the project (i.e. the columns and date for the "table")
- [Server] Extend functionality Task entity to include custom tasks (i.e. custom columns)
- TBC... sometime in the future...
- Enable "sharing" of projects
- Users can only own up to 3 boards if they are in free tier. Shared is not counted. 
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