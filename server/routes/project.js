import { Router } from 'express'
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  editSharing,
  deleteSharing,
} from '../controllers/project'

const router = Router()

router.get('/', getAllProjects)
router.get('/:id', getProjectById)
router.post('/', createProject)
router.put('/:id/sharing', editSharing) // place above update project else have clash
router.delete('/:id/sharing', deleteSharing) // place above update project else have clash
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router
