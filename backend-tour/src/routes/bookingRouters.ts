import { Router } from "express";
import { createBooking } from "../controllers/bookingController";

const router = Router();

// Route đặt tour
router.post("/", createBooking);

export default router;
