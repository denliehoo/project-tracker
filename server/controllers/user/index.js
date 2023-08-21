require("dotenv").config();
import models from "../../models";
import { findUserByEmail, findUserById } from "../../utility/findFromDb";
import {
  comparePasswords,
  hashPassword,
  validatePasswordStrength,
} from "../../utility/passwords";
import axios from "axios";

const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { User } = models;

const getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.send(users);
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.body.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.send(user);
};

// aka register user
const createUser = async (req, res) => {
  let user;
  let { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Cannot be empty" });

  const isValidPassword = validatePasswordStrength(password);
  if (!isValidPassword)
    return res.status(400).json({
      error:
        "Enter a stronger password. Password must be at least 8 alphanumeric characters with one capitalized and non-capitalized and one special character",
    });

  const hashedPassword = await hashPassword(password);

  let emailExistsInDb = await User.find({ email: email });
  emailExistsInDb = emailExistsInDb.length > 0 ? true : false;
  if (emailExistsInDb)
    return res.status(400).json({ error: "Email already exists" });

  const stripeCustomer = await stripe.customers.create({
    email: email,
    description: "New customer!",
  });

  const recurCryptApiUrl = process.env.RECURCRYPT_ENDPOINT;
  const recurCryptVendorId = process.env.RECURCRYPT_VENDOR_ID;
  const recurCryptApiKeys = process.env.RECURCRYPT_SECRET_KEY;

  try {
    const headers = {
      Authorization: recurCryptApiKeys,
    };

    const recurCryptClient = await axios.post(
      `${recurCryptApiUrl}/vendorClients/create/${recurCryptVendorId}`,
      null,
      {
        headers,
      }
    );

    if (!recurCryptClient)
      return res.status(401).json({ error: "Error in recurcrypt services" });

    const vendorClientId = await recurCryptClient.data._id;

    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      stripeId: stripeCustomer.id,
      recurCryptId: vendorClientId,
    });
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }

  return res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.find({ email: email });
  if (user.length === 0)
    return res.status(400).json({ error: "User not found" });

  const isCorrectPassword = await comparePasswords(password, user[0].password); // true or false
  if (!isCorrectPassword)
    return res.status(400).json({ error: "Incorrect Password" });

  const token = generateJWT(email);
  return res.send({ token: token });
};

const changePaidStatus = async (req, res) => {
  const { email, isPremium } = req.body;
  let user = await findUserByEmail(email);
  if (!isPremium && user.isPremium) {
    // means changing user from premium to not premium
    user.isPremium = false;
    if (user.ownProjects.length > 1) {
      // lock their projects only if they have >1 project
      for (let p of user.ownProjects) {
        p.locked = true;
      }
    }
    await user.save();
    return res.send(user);
  }
  if (isPremium && !user.isPremium) {
    // means changing user from not premium to premium
    user.isPremium = true;
    for (let p of user.ownProjects) {
      p.locked = false;
    }
    user = await user.save();
    return res.send(user);
  }

  return res.status(400).json({
    error: `Unable to change user premium status from ${isPremium} to ${isPremium}`,
  });
};
// Google OAUTH
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Add your custom logic to handle the user's profile data
      console.log("User Profile:", profile);
      let user = await findUserByEmail(profile.emails[0].value);
      if (!user) {
        const stripeCustomer = await stripe.customers.create({
          email: profile.emails[0].value,
          description: "New customer!",
        });

        const hashedPassword = await hashPassword(
          "TempUserPasswordForOAuth1234!"
        );

        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: hashedPassword,
          stripeId: stripeCustomer.id,
          googleId: profile.id,
        });
      }
      const token = generateJWT(user.email);

      return done(null, { profile, token });
    }
  )
);

// Handle Google OAuth authentication
// http://localhost:3001/users/auth/google
// ^client should click the google log in on frontend and open a new tab to this page to do the login
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Handle Google OAuth callback and redirection
const googleAuthCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, data) => {
      // console.log(data.profile)
      // console.log(data.token)
      if (err) {
        console.log("Error has occured.....");
        // Handle any error that occurred during authentication
        console.log(err);
        return next(err);
      }

      // Successful authentication, redirect to the desired page
      res.redirect(`http://localhost:3000/login?token=${data.token}`);
    }
  )(req, res, next);
};

// helper functions
const generateJWT = (email) => {
  // Set the expiration time for the JWT token (e.g., 1 hour from now)
  // if want to change the time, change the 3600 (which is 60s * 60 min = 3600s = 1 hr)
  // const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour (in seconds)
  const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour (in seconds)

  const token = jwt.sign(
    { email: email, exp: expirationTime },
    process.env.JWT_KEY
  );
  return token;
};

const getUserByEmail = async (req, res) => {
  if (req.email !== req.body.email)
    return res.status(403).json({
      error: "You are not forbidden to see this as you are not the user",
    });
  let user = await findUserByEmail(req.email);
  // if date and time now is later than the end date change is premium to false, endDate to null and plan to 'none'
  // if user is premium and there is a end date and the end date is before the current date (i.e. susbscription ended)
  // this is for stripe
  // if (user.isPremium && user.endDate && new Date(Date.now()) > user.endDate) {
  //   user.isPremium = false;
  //   user.endDate = null;
  //   user.plan = "none";
  //   await user.save();
  // }

  return res.send(user);
};

export {
  createUser,
  getAllUsers,
  getUserById,
  login,
  changePaidStatus,
  googleAuth,
  googleAuthCallback,
  getUserByEmail,
};
