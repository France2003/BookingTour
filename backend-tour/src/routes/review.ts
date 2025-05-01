import express from "express";
import { addReview } from "../controllers/reviewController";

const router = express.Router();

// POST /api/reviews/:id
router.post("/:id", addReview);

export default router;
