import { io, memoryStats, memorySpamReports } from "../store";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(memoryStats);
});

export default router;
