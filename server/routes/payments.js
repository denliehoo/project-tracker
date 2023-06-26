import { Router } from 'express'
import { handleStripeWebhook } from '../controllers/payments'

const router = Router()

router.post('/stripe/webhook', handleStripeWebhook)

export default router
