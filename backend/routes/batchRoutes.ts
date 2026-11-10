import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createBatchHandler,
  getBatchHandler,
  listBatchesHandler,
} from "../controllers/batchController.js";
import { limiter } from "../middleware/batchRateLimit.js";

const router = Router();

router.post("/batches", requireAuth, limiter, createBatchHandler);
router.get("/batches", requireAuth, listBatchesHandler);
router.get("/batches/:id", requireAuth, getBatchHandler);

export default router;
