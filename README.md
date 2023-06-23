# project-tracker
A full stack MERN app. 
This is a Software as a Service (SaaS) application that helps people to keep track of their project, including history of the project. 

# client
npm start

# server
in terminal, run: 
- mongod
    - this will start up mongo db locally
in a separate terminal:
- cd server
- npm start

for installation of mongodb for mac:
Go to Homebrew copy the "Install Brew" link from there, paste and run. To check the version of brew
- brew -v 
- brew tap mongodb/brew 
- brew install mongodb-community 
- sudo mkdir -p /System/Volumes/Data/data/db 
- sudo chown -R `id -un` /System/Volumes/Data/data/db 
- Note: I cant seem to run the next step but after the previous step, it seems like I can do transactions on postman
- sudo mongod --dbpath /System/Volumes/Data/data/db 
- this would run your MongoDB .

Then open another tab on terminal(command + t), and type
- mongosh

Note: for testing with postman, 
- Call the login api first to get the token
- Then need put in the Headers: Key: Authorization    , value: JWT TOKEN which was returned from the login

## .env in server
PORT=3001
DATABASE_URL=mongodb://127.0.0.1:27017/project-tracker
JWT_KEY=TEMPKEY