import express, { Request, Response } from "express";
import User  from "../models/UserModel";
import Tour  from "../models/Tour"; 
import { Booking } from "../models/Booking"; 
import { Revenue } from "../models/Revenue";

const router = express.Router();

router.get("/stats", async (req: Request, res: Response) => {
    try {
        // Lấy tổng số người dùng
        const totalUsers = await User.countDocuments({ role: "user" });

        // Lấy tổng số tour
        const totalTours = await Tour.countDocuments();

        // Lấy tổng số booking
        const totalBookings = await Booking.countDocuments();

        // Lấy tổng doanh thu (giả sử bạn có model Revenue hoặc tính từ các booking)
        const totalRevenue = await Revenue.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Lấy doanh thu hàng tháng
        const revenueData = await Revenue.aggregate([
            { $project: { month: { $month: "$date" }, year: { $year: "$date" }, amount: 1 } },
            { $group: { _id: { month: "$month", year: "$year" }, total: { $sum: "$amount" } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Trả về dữ liệu thống kê
        res.json({
            totalUsers,
            totalTours,
            totalBookings,
            revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
            revenueData
        });
    } catch (error) {
        console.error("❌ Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
