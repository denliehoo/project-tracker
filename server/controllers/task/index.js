import models from '../../models'
const { Task, Project, User } = models

// this is for admin to get every single task
const getAllTasks = async (req, res) => {
  if (req.headers.admin !== 'fosure')
    return res.status(401).json({ error: 'Only admin can use this' })
  try {
    const tasks = await Task.find().populate('project')
    return res.json(tasks)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

const getAllTasksForProject = async (req, res) => {
  const id = req.params.id
  const canAccess = await checkIfOwnerOrEditor(req.email, id)
  if (!canAccess)
    return res.status(403).json({ error: 'You are not authorized' })

  const isProjectLocked = await checkIfProjectLocked(id)
  if (isProjectLocked)
    return res.status(403).json({ error: 'Project has been locked' })

  try {
    const tasks = await Task.find({ project: id }).populate('project')
    return res.json(tasks)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

const createTask = async (req, res) => {
  try {
    let { item, nextAction, priority, project } = req.body
    const canAccess = await checkIfOwnerOrEditor(req.email, project)
    if (!canAccess)
      return res.status(403).json({ error: 'You are not authorized' })

    const isProjectLocked = await checkIfProjectLocked(project)
    if (isProjectLocked)
      return res.status(403).json({ error: 'Project has been locked' })

    const task = new Task({ item, nextAction, priority, project })
    await task.save()
    res.status(201).json(task)
  } catch (error) {
    // usually means project id is wrong
    res.status(500).json({ error: 'Failed to create task' })
  }
}

const updateTask = async (req, res) => {
  const id = req.params.id
  let task = await findTaskById(id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const canAccess = await checkIfOwnerOrEditor(req.email, task.project)
  if (!canAccess)
    return res.status(403).json({ error: 'You are not authorized' })

  const isProjectLocked = await checkIfProjectLocked(task.project)
  if (isProjectLocked)
    return res.status(403).json({ error: 'Project has been locked' })

  const { item, nextAction, priority } = req.body
  if (!item || !nextAction || !priority)
    return res.status(404).json({ error: 'Cannot be empty' })

  if (task.nextAction !== nextAction) {
    task.nextActionHistory.push({
      time: new Date(Date.now()),
      data: task.nextAction,
    })
    task.nextAction = nextAction
  }
  task.item = item
  task.priority = priority

  task = await task.save()
  return res.send(task)
}

const deleteTask = async (req, res) => {
  const id = req.params.id
  let task = await findTaskById(id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const canAccess = await checkIfOwnerOrEditor(req.email, task.project)
  if (!canAccess)
    return res.status(403).json({ error: 'You are not authorized' })

  const isProjectLocked = await checkIfProjectLocked(task.project)
  if (isProjectLocked)
    return res.status(403).json({ error: 'Project has been locked' })

  task = await Task.deleteOne({ _id: id })
  res.send(task)
}

// helpers
const findTaskById = async (id) => {
  try {
    const task = await Task.findById(id)
    return task
  } catch {
    return null
  }
}
const checkIfOwnerOrEditor = async (email, projectId) => {
  let project
  try {
    project = await Project.findById(projectId)
  } catch {
    return false
  }
  return email === project?.owner || project?.editors?.includes(email)
    ? true
    : false
}
const checkIfProjectLocked = async (projectId) => {
  let project, user
  try {
    project = await Project.findById(projectId)
  } catch {
    return true
  }
  try {
    user = await User.find({ email: project.owner })
    user = user[0]
  } catch {
    return true
  }
  for (let p of user.ownProjects) {
    // do .toString() incase it is passed as an objectId instead of a string
    // remember: if we end up comparing object to object, obj1 === obj2 will never be the same even if
    // they have the same contents. Hence, convert to string and do the comparision
    if (p.project.toString() == projectId.toString()) return p.locked
  }
  return true
}

export {
  getAllTasks,
  createTask,
  getAllTasksForProject,
  updateTask,
  deleteTask,
}
