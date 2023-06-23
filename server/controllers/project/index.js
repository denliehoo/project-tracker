import models from '../../models'
const { Project } = models

const getAllProjects = async (req, res) => {
  const email  = req.email;
  let projects;
  projects = await Project.find({owner: email})
  // ***temp for admin to see all***
  if(req.headers.admin === 'fosure') projects = await Project.find()
  // *******
  return res.send(projects)
}

const getProjectById = async (req, res) => {
  const project = await findProjectById(req.params.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (project.owner !== req.email) return res.status(401).json({error: "You are forbidden to view this"})
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
  if (project.owner !== req.email) return res.status(401).json({error: "You are forbidden to update this"})
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
  if (project.owner !== req.email) return res.status(401).json({error: "You are forbidden to delete this"})
  project = await Project.deleteOne({ _id: id })
  res.send(project)
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
}