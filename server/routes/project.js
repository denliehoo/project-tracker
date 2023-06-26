import { Router } from 'express'
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  editSharing,
  deleteSharing,
  changeLockedProject,
} from '../controllers/project'

const router = Router()

router.get('/', getAllProjects)
router.get('/:id', getProjectById)
router.post('/', createProject)
router.put('/:id/unlockProject', changeLockedProject)
router.put('/:id/sharing', editSharing) // place above update project else have clash
router.delete('/:id/sharing', deleteSharing) // place above delete project else have clash
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router
