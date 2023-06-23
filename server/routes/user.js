import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  login,
} from "../controllers/user";

const router = Router();

router.get("/", getAllUsers);

router.get("/getUserById", getUserById);

router.post("/", createUser);

router.post("/login", login);
// Note: when doing the frontend, remember that login returns the JWT. Need to save it locally so tht users can access API

export default router;