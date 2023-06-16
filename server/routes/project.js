// import { v4 as uuidv4 } from "uuid";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  return res.send("Hello from project route");
});

router.get("/:projectId", async (req, res) => {
  return res.send(`hello from project id ${req.params.projectId}`);
});

export default router;
