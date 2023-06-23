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

router.get("/login", login);

export default router;
