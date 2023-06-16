require("dotenv").config();
// const cors = require("cors");

import models, { connectDb } from "./models";
import routes from "./routes";
// Import Express module
const express = require("express");

// Create an Express application
const app = express();

// middlewares
// app.use(cors()); // use the cors middleware as an application-wide middleware by using express' use method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// app.use("/session", routes.session);
app.use("/projects", routes.project);
// app.use("/messages", routes.message);

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
  console.log("Hello world");
  console.log(process.env.PORT);
});

// connectDb().then(async () => {
//     if (eraseDatabaseOnSync) {
//       // re-initialize DB upon restart server
//       await Promise.all([
//         models.User.deleteMany({}),
//         models.Message.deleteMany({}),
//       ]);
//       createUsersWithMessages(); // seed database
//     }

//     app.listen(process.env.PORT, () =>
//       console.log(`Example app listening on port ${process.env.PORT}!`)
//     );
//   });
