require('dotenv').config()
import models from '../../models'
import {
  comparePasswords,
  hashPassword,
  validatePasswordStrength,
} from '../../utility/passwords'
const jwt = require('jsonwebtoken')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { User } = models

const getAllUsers = async (req, res) => {
  console.log(process.env.GOOGLE_OAUTH_CLIENT_ID)
  const users = await User.find()
  return res.send(users)
}

const getUserById = async (req, res) => {
  const user = await findUserById(req.body.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.send(user)
}

// aka register user
const createUser = async (req, res) => {
  let user
  let { name, email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Cannot be empty' })

  const isValidPassword = validatePasswordStrength(password)
  if (!isValidPassword)
    return res.status(400).json({
      error:
        'Enter a stronger password. Password must be at least 8 alphanumeric characters with one capitalized and non-capitalized and one special character',
    })

  const hashedPassword = await hashPassword(password)

  let emailExistsInDb = await User.find({ email: email })
  emailExistsInDb = emailExistsInDb.length > 0 ? true : false
  if (emailExistsInDb)
    return res.status(400).json({ error: 'Email already exists' })

  const stripeCustomer = await stripe.customers.create({
    email: email,
    description: 'New customer!',
  })

  try {
    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      stripeId: stripeCustomer.id,
    })
  } catch (error) {
    return res.status(400).json({ error: error.toString() })
  }

  return res.send(user)
}

const login = async (req, res) => {
  const { email, password } = req.body
  let user = await User.find({ email: email })
  if (user.length === 0)
    return res.status(400).json({ error: 'User not found' })

  const isCorrectPassword = await comparePasswords(password, user[0].password) // true or false
  if (!isCorrectPassword)
    return res.status(400).json({ error: 'Incorrect Password' })

  const token = jwt.sign({ email: email }, process.env.JWT_KEY)
  return res.send({ token: token })
}

const changePaidStatus = async (req, res) => {
  const { email, isPremium } = req.body
  let user = await findUserByEmail(email)
  if (!isPremium && user.isPremium) {
    // means changing user from premium to not premium
    user.isPremium = false
    if (user.ownProjects.length > 1) {
      // lock their projects only if they have >1 project
      for (let p of user.ownProjects) {
        p.locked = true
      }
    }
    await user.save()
    return res.send(user)
  }
  if (isPremium && !user.isPremium) {
    // means changing user from not premium to premium
    user.isPremium = true
    for (let p of user.ownProjects) {
      p.locked = false
    }
    user = await user.save()
    return res.send(user)
  }

  return res.status(400).json({
    error: `Unable to change user premium status from ${isPremium} to ${isPremium}`,
  })
}
// Google OAUTH
// need find a way to delay this since the env is undefined if we execute immediately
passport.use(
  new GoogleStrategy(
    {
      clientID: 'REPLACEME',
      // clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      clientSecret: 'REPLACEME',
      callbackURL: '/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Add your custom logic to handle the user's profile data
      console.log('User Profile:', profile)
      console.log(profile.emails[0].value)
      // const user = await findUserByEmail(profile.emails[0].value)
      // console.log(user)
      // Here, you can create or find the user in your database and perform login/registration
      // For simplicity, we'll just pass the profile data to the callback
      return done(null, profile)
    },
  ),
)

// Handle Google OAuth authentication
// http://localhost:3001/users/auth/google
// ^client should click the google log in on frontend and open a new tab to this page to do the login
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
})

// Handle Google OAuth callback and redirection
const googleAuthCallback = async (req, res, next) => {
  passport.authenticate(
    'google',
    { failureRedirect: '/login' },
    (err, user) => {
      console.log('****this is user*****')
      console.log(user)
      if (err) {
        // Handle any error that occurred during authentication
        console.log('there is an error')
        console.log(err)
        return next(err)
      }

      console.log('redirect time')
      // Successful authentication, redirect to the desired page
      res.redirect('/dashboard')
    },
  )(req, res, next)
}
// helper functions
const findUserById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch {
    return null
  }
}

const findUserByEmail = async (email) => {
  try {
    const user = await User.find({ email: email })
    return user[0]
  } catch {
    return null
  }
}

export {
  createUser,
  getAllUsers,
  getUserById,
  login,
  changePaidStatus,
  googleAuth,
  googleAuthCallback,
}
