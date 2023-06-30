require('dotenv').config()
// const cors = require("cors");

import models, { connectDb } from './models'
import routes from './routes'
import { authenticateJWT } from './middleware/authenticateJWT'
import { jsonOrRaw } from './middleware/jsonOrRaw'
import { hashPassword } from './utility/passwords'
const express = require('express')
const cors = require('cors')
// const bodyParser = require("body-parser");

// Create an Express application
const app = express()

// middlewares
app.use(cors()) // use the cors middleware as an application-wide middleware by using express' use method
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) // for stripe
// this middleware was made because i only need to use express.raw for webhook route and all other need to use express.json..
// hence, only if path is for the webhook, we use express.raw
app.use(jsonOrRaw)

// routes
// app.use("/session", routes.session);
app.use('/users', routes.user)
app.use('/projects', authenticateJWT, routes.project)
app.use('/tasks', authenticateJWT, routes.task)
app.use('/payments', routes.payments)
// app.use("/messages", routes.message);

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

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

  // actual flow is creater user> create project. But for here is ok since just seeding database
  // and since entities are linked through email
  const alicePassword = await hashPassword('AlicePassword1234!')
  const alice = new models.User({
    name: 'Alice Sis',
    email: 'alice@test.com',
    stripeId: 'cus_OAsz0Tk5M6ZbTG',
    password: alicePassword,
    ownProjects: [{ project: aliceProject._id, locked: false }],
  })
  const bobPassword = await hashPassword('BobPassword1234!')
  const bob = new models.User({
    name: 'Bob Bro',
    email: 'bob@test.com',
    password: bobPassword,
    ownProjects: [{ project: bobProject._id, locked: false }],
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
