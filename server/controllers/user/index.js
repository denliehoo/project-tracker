import models from "../../models";
import {
  comparePasswords,
  hashPassword,
  validatePasswordStrength,
} from "../../utility/passwords";
const jwt = require('jsonwebtoken');

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

  if (!name || !email || !password)
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

  try {
    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
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

  const token = jwt.sign({ email: email }, process.env.JWT_KEY);  
  return res.send({token: token});
};

// helper functions
const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    return user;
  } catch {
    return null;
  }
};

export { createUser, getAllUsers, getUserById, login };
