require('dotenv').config()
// const cors = require("cors");

import models, { connectDb } from './models'
import routes from './routes'
import { authenticateJWT } from './middleware/authenticateJWT'
import { hashPassword } from './utility/passwords'
const express = require('express')

// Create an Express application
const app = express()

// middlewares
// app.use(cors()); // use the cors middleware as an application-wide middleware by using express' use method
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
// app.use("/session", routes.session);
app.use('/users', routes.user)
app.use('/projects', authenticateJWT, routes.project)
app.use('/tasks', authenticateJWT, routes.task)
// app.use("/messages", routes.message);

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Start the server
// app.listen(3001, () => {
//   console.log("Server is running on http://localhost:3001");
//   console.log("Hello world");
//   console.log(process.env.PORT);
// });

connectDb().then(async () => {
  // change to true/false if want to reset and seed db
  if (false) {
    console.log('Re-seeding database!')

    // clear database
    await Promise.all([
      models.Project.deleteMany({}),
      models.User.deleteMany({}),
      models.Task.deleteMany({}),
    ])
    await seedDataBase()
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  )
})

const seedDataBase = async () => {
  const alicePassword = await hashPassword('AlicePassword1234!')
  const alice = new models.User({
    name: 'Alice Sis',
    email: 'alice@test.com',
    password: alicePassword,
  })
  const bobPassword = await hashPassword('BobPassword1234!')
  const bob = new models.User({
    name: 'Bob Bro',
    email: 'bob@test.com',
    password: bobPassword,
  })
  const aliceProject = new models.Project({
    name: 'Alice Test Project!',
    description: 'this is alice test project',
    id: '123',
    owner: 'alice@test.com',
  })
  const bobProject = new models.Project({
    name: 'Bob Test Project!',
    description: 'this is a bob test project',
    id: '123',
    owner: 'bob@test.com',
  })
  const aliceTask = new models.Task({
    item: 'Alice Item',
    nextAction: 'Do 3',
    nextActionHistory: [
      { time: new Date(Date.now() - 24 * 60 * 60 * 1000), data: 'Do 1' },
      { time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), data: 'Do 2' },
    ],
    priority: 100,
    project: aliceProject._id,
  })
  const bobTask = new models.Task({
    item: 'Bob Item',
    nextAction: 'do some stuff bob',
    nextActionHistory: [],
    priority: 100,
    project: bobProject._id,
  })

  await alice.save()
  await bob.save()
  await aliceProject.save()
  await bobProject.save()
  await aliceTask.save()
  await bobTask.save()
}
