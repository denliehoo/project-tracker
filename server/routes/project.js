import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import models from "../models";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = Router();

router.get("/", getAllProjects);
router.get("/:id",authenticateJWT, getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
