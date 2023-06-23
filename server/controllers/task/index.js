import models from '../../models'
const { Task, Project, User } = models

// this is for admin to get every single task
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('project')
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

const getAllTasksForProject = async (req, res) => {
  try {
    const id = req.params.id
    const tasks = await Task.find({ project: id }).populate('project')
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

const createTask = async (req, res) => {
  try {
    const { item, nextAction, priority, project } = req.body
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

  const { item, nextAction, priority } = req.body
  if (!item || !nextAction || !priority)
    return res.status(404).json({ error: 'Cannot be empty' })

  task.item = item
  task.nextAction = nextAction
  task.priority = priority

  task = await task.save()
  return res.send(task)
}

const deleteTask = async (req, res) => {
  const id = req.params.id
  let task = await findTaskById(id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

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

export {
  getAllTasks,
  createTask,
  getAllTasksForProject,
  updateTask,
  deleteTask,
}
