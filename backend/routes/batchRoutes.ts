import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createBatchHandler,
  getBatchHandler,
} from "../controllers/batchController.js";

const router = Router();

router.post("/batches", requireAuth, createBatchHandler);
router.get("/batches/:id", requireAuth, getBatchHandler);

export default router;
