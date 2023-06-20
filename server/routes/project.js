import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import models from "../models";
import {
  getAllProjects,
  getProjectById,
  createProject,
} from "../controllers/project";

const router = Router();

router.get("/", getAllProjects);

router.get("/:projectId", getProjectById);

router.post("/", createProject);

export default router;
