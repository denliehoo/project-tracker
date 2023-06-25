import models from '../../models'
const { Project, User } = models

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
  let project
  try {
    project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      id: req.body.id,
      owner: req.email,
    })
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
  project = await Project.deleteOne({ _id: id })
  res.send(project)
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
  // console.log(toShare)
  // console.log(project.editors)
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

// helper functions
const findProjectById = async (id) => {
  try {
    const project = await Project.findById(id)
    return project
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
}
