import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getAllTasksForProject,
} from '../controllers/task'

const router = Router()

router.get('/', getAllTasks)

router.get('/:id', getAllTasksForProject)

router.post('/', createTask)

router.put('/:id', updateTask)

router.delete('/:id', deleteTask)

export default router
