import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";
import { getTours, createTour, updateTour, deleteTour, updateTourStatus } from "../controllers/tourController";

const router = express.Router();

// ✅ Lấy danh sách tour
router.get("/", getTours);
//
// router.get("/location/:slug", getToursByLocation); 
// ✅ Thêm tour mới (Chỉ admin)
router.post("/", verifyToken, isAdmin, createTour);

// ✅ Cập nhật tour (Chỉ admin)
router.put("/:id", verifyToken, isAdmin, updateTour);

// ✅ Xóa tour (Chỉ admin)
router.delete("/:id", verifyToken, isAdmin, deleteTour);
router.patch('/:id/status', updateTourStatus);

export default router;
