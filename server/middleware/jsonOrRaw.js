const express = require("express");

const jsonOrRaw = (req, res, next) => {
  if (req.path === "/payments/stripe/webhook") {
    // Apply the express.raw middleware only for the webhook route
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    // For other routes, continue to the next middleware
    express.json()(req, res, next);
  }
};

export { jsonOrRaw };
