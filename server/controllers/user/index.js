import models from "../../models";
const { User } = models;

const getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.send(users);
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.send(user);
};

const createUser = async (req, res) => {
  let user;
  let { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Cannot be empty" });

  let emailExistsInDb = await User.find({ email: email });
  emailExistsInDb = emailExistsInDb.length > 0 ? true : false;
  if (emailExistsInDb)
    return res.status(400).json({ error: "Email already exists" });

  try {
    // if empty throw error here
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
  return res.send(user);
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

export { createUser, getAllUsers, getUserById };
