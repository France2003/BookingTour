import { Router } from "express";
import { addPassengers, createBooking, getAllBookings, getBookingById, updateBookingPayment } from "../controllers/bookingController";

const router = Router();

// Route đặt tour
router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/:id/passengers", addPassengers);
router.patch("/:id", updateBookingPayment);
export default router;
