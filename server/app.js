// app.js

// Import Express module
const express = require("express");

// Create an Express application
const app = express();

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
