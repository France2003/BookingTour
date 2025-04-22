import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import tourRoutes from "./routes/tourRoutes";
import adminRoutes from "./routes/adminRoutes"; 
import bookingRoutes from "./routes/bookingRouters";
import cors from "cors";
import { createAdminAccount } from "./utils/createAdmin";
import { getTourById, updateTourStatus } from "./controllers/tourController";
import paymentRoutes from "./routes/paymentRoutes";
dotenv.config();
const app: Application = express(); // 👈 Định nghĩa kiểu dữ liệu rõ ràng
const PORT: number = parseInt(process.env.PORT || "3001", 10); // 👈 Chuyển đổi kiểu dữ liệu từ string -> number
const connectToMongo = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_DB) {
            throw new Error("❌ MONGO_DB is not defined in .env file!");
        }
        await mongoose.connect(process.env.MONGO_DB);
        console.log("✅ Connected to MongoDB");
        await createAdminAccount();
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};
connectToMongo();
createAdminAccount(); 
console.log("Connected to MongoDB", process.env.MONGO_DB);
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
}));
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/bookings", bookingRoutes);
app.get('/api/tours/:id', getTourById);
app.patch('/api/tours/:id/status', updateTourStatus);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
