import { Router } from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  login,
  changePaidStatus,
  googleAuth,
  googleAuthCallback,
  getUserByEmail,
} from '../controllers/user'
import { authenticateJWT } from '../middleware/authenticateJWT'
const router = Router()

router.get('/', getAllUsers)

router.get('/getUserById', getUserById)

router.post('/getUserByEmail', authenticateJWT, getUserByEmail)

router.post('/', createUser)

router.post('/login', login)
// Note: when doing the frontend, remember that login returns the JWT. Need to save it locally so tht users can access API

router.put('/paidStatus', changePaidStatus)

router.get('/auth/google', googleAuth)

router.get('/auth/google/callback', googleAuthCallback)
// router.get('/auth/google/callback', googleAuthCallback, (req, res) => {
//   res.redirect('/dashboard')
// })

export default router
