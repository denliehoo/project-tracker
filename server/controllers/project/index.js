import models from '../../models'
const { Project, User, Task } = models

const getAllProjects = async (req, res) => {
  const email = req.email
  let projects, sharedProject
  const ownProjects = await Project.find({ owner: email })
  try {
    sharedProject = await Project.find({ editors: email })
  } catch {
    sharedProject = []
  }
  projects = {
    owner: ownProjects,
    editor: sharedProject,
  }

  // ***temp for admin to see all***
  if (req.headers.admin === 'fosure') projects = await Project.find()
  // *******
  return res.send(projects)
}

const getProjectById = async (req, res) => {
  const project = await findProjectById(req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  // if not the owner and not editor
  if (project.owner !== req.email && !project.editors.includes(req.email))
    return res.status(401).json({ error: 'You are forbidden to view this' })
  return res.send(project)
}

const createProject = async (req, res) => {
  let project, user
  user = await findUserByEmail(req.email)
  if (!user.isPremium && user.ownProjects.length > 0)
    return res.status(401).json({ error: 'Free users can only own 1 board' })

  try {
    project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      id: req.body.id,
      owner: req.email,
    })
    await user.ownProjects.push({ project: project._id, locked: false })
    await user.save()
  } catch (error) {
    return res.status(400).json({ error: error.toString() })
  }
  return res.send(project)
}

const updateProject = async (req, res) => {
  const id = req.params.id
  let project = await findProjectById(id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.owner !== req.email)
    return res.status(401).json({ error: 'You are forbidden to update this' })
  // update the project description here
  // definitely need do refactoring here
  // if got many more key values, it will be troublesome to code one by one. Is there another way?
  const { description, name } = req.body
  if (!description || !name)
    return res.status(404).json({ error: 'Cannot be empty' })
  project.name = name
  project.description = description
  project = await project.save()
  return res.send(project)
}

const deleteProject = async (req, res) => {
  const id = req.params.id
  let project = await findProjectById(id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.owner !== req.email)
    return res.status(401).json({ error: 'You are forbidden to delete this' })

  let user = await findUserByEmail(req.email)
  // != instead of !== cause type isnt strictly the same; input it text and type
  // in ownProjects is ObjectId (mongodb)
  const tempOwnProjects = await user.ownProjects.filter((p) => p.project != id)
  user.ownProjects = tempOwnProjects
  await user.save()
  await Task.deleteMany({ project: id }) // removes all tassks associated with the Project
  project = await Project.deleteOne({ _id: id })
  return res.send(project)
}

const editSharing = async (req, res) => {
  const id = req.params.id
  let project = await findProjectById(id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.owner !== req.email)
    return res.status(401).json({ error: 'You are forbidden to edit this' })

  let result = {
    isAddSelf: false, // if user tries to share with themself
    alreadySharing: [],
    doesntExist: [],
    added: [],
    updatedSharing: [],
  }
  const toShare = req.body.email
  if (!Array.isArray(toShare))
    return res
      .status(400)
      .json({ error: 'Bad request. Email should be an array of strings' })
  const current = project.editors

  for (let u of toShare) {
    if (u === req.email) {
      result.isAddSelf = true
      continue
    }
    if (current.includes(u)) {
      result.alreadySharing.push(u)
      continue
    }
    const exists = await User.find({ email: u })
    if (exists.length === 0) {
      result.doesntExist.push(u)
      continue
    }
    result.added.push(u)
    current.push(u)
  }
  await project.save()
  result.updatedSharing = current
  res.send(result)
}

const deleteSharing = async (req, res) => {
  const id = req.params.id
  let project = await findProjectById(id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.owner !== req.email)
    return res.status(401).json({ error: 'You are forbidden to edit this' })

  let result = {
    isRemoveSelf: false, // if user tries to share with themself
    notSharing: [],
    removed: [],
    updatedSharing: [],
  }
  const toRemove = req.body.email
  if (!Array.isArray(toRemove))
    return res
      .status(400)
      .json({ error: 'Bad request. Email should be an array of strings' })
  let current = project.editors

  for (let u of toRemove) {
    if (u === req.email) {
      result.isRemoveSelf = true
      continue
    }
    if (current.includes(u)) {
      current = current.filter((user) => user !== u)
      result.removed.push(u)
      continue
    }
    // if here means project is already not shared with user
    result.notSharing.push(u)
  }
  project.editors = current
  await project.save()
  result.updatedSharing = current
  res.send(result)
}

const changeLockedProject = async (req, res) => {
  const email = req.email
  const id = req.params.id
  let user = await findUserByEmail(email)
  if (user.isPremium)
    return res
      .status(401)
      .json({ error: 'Only free users have to unlock projects' })
  let userIsOwner = false
  for (let p of user.ownProjects) {
    // not strictly equal
    if (p.project == id) {
      userIsOwner = true
      p.locked = false
    } else {
      p.locked = true
    }
  }
  if (!userIsOwner) return res.send('you are not the owner!!!!')
  await user.save() // only save to db if user is the owner
  return res.send(user)

  // change the locked project to false for the id that was provided
  // the other projects will be locked = true
  // meaning if lets say a was unlocked and b locked, and b id was passed
  // then unlock b and lock a. let user know in frontend that it will be locked
  // if both a and b locked, then just unlock b if b is passed
  // this function is only for if user is not premium user
  // and has > 1 Project
}

// helper functions
const findProjectById = async (id) => {
  try {
    const project = await Project.findById(id)
    return project
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
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  editSharing,
  deleteSharing,
  changeLockedProject,
}
