import { Router } from "express";
import {
  handleStripeWebhook,
  createCheckoutSession,
  createPortalSession,
  stripeWebhook,
  recurCryptWebhook,
} from "../controllers/payments";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.post("/recurcrypt/webhook", recurCryptWebhook);
router.post("/stripe/webhook", stripeWebhook);
router.post(
  "/stripe/create-portal-session",
  authenticateJWT,
  createPortalSession
);
router.post(
  "/stripe/create-checkout-session",
  authenticateJWT,
  createCheckoutSession
);

export default router;
