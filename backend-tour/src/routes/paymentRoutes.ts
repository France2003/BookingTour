import express from "express";
import { sendConfirmationEmailController, getPaymentDetails } from "../controllers/paymentController";

const router = express.Router();

// API gửi email xác nhận
router.post("/send-confirmation-email", sendConfirmationEmailController);

// API lấy thông tin thanh toán từ DB
router.get("/bookings/:id", getPaymentDetails);

export default router;
