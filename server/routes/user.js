import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  return res.send("This is all users");
});

router.get("/:userId", async (req, res) => {
  return res.send(`Hello from userId: ${req.params.userId}`);
});

router.post("/:userId", async (req, res) => {
  return res.send(`Creating userId: ${req.params.userId}`);
});

export default router;
