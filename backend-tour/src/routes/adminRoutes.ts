import express, { Request, Response } from "express";
import { Booking } from "../models/Booking";  // Mô hình booking
import Tour, { ITour } from "../models/Tour";  // Mô hình tour
import User from "../models/UserModel";  // Mô hình người dùng

const router = express.Router();

router.get("/stats", async (req: Request, res: Response) => {
  try {
    // Lấy tổng số người dùng
    const totalUsers = await User.countDocuments({ role: "user" });
    // Lấy tổng số tour
    const totalTours = await Tour.countDocuments();
    // Lấy tổng số booking
    const totalBookings = await Booking.countDocuments();
    // Tổng doanh thu: lấy tất cả booking đã hoàn thành
    const completedBookings = await Booking.find({ status: "completed" }).populate("tourId");
    const revenue = completedBookings.reduce((acc, booking) => {
      const tour = booking.tourId as ITour;
      return acc + (tour.price || 0);
    }, 0);
    res.json({
      totalUsers,
      totalTours,
      totalBookings,
      revenue,
    });

  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/revenue", async (req: Request, res: Response) => {
  try {
    const monthlyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        }
      }
    ]);
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    const revenueData = allMonths.map((month) => {
      const data = monthlyRevenue.find((item) => item._id.month === month);
      return {
        month: month,
        totalRevenue: data ? data.totalRevenue : 0,
      };
    });
    res.status(200).json(revenueData);  
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thống kê doanh thu theo tháng", error });
  }
});
export default router;
