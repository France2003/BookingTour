import { Router } from "express";
import { addPassengers, createBooking, DeteleBooking, getAllBookings, getBookingById, getBookingsByEmail, updateBookingPayment } from "../controllers/bookingController";

const router = Router();

// Route đặt tour
router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/:id/passengers", addPassengers);
router.patch("/:id", updateBookingPayment);
router.delete("/:id", DeteleBooking);
// router.get("/revenue", getMonthlyRevenue);
router.get('/bookings', getBookingsByEmail);
export default router;
