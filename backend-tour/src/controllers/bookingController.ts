import { Request, Response } from "express";
import { Booking } from "../models/Booking"; // Sequelize model

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("📝 Dữ liệu nhận được:", req.body);
        const {
            tourId,
            adults,
            children,
            babies,
            paymentType,      // 'full' | 'half'
            paymentMethod,    // 'atm' | 'momo'
            totalAmount,      // Tổng tiền
            status,
            // userId           
        } = req.body;
        if (!tourId || !adults || !paymentType || !paymentMethod || !totalAmount) {
            res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
            return;
        }
        if (paymentType === null || paymentType === undefined) {
            res.status(400).json({ message: "Payment type is required!" });
            return;
        }
        // Lấy ngày hiện tại cho booking
        const date = new Date();
        // Tạo booking
        const newBooking = await Booking.create({
            // userId,          
            tourId,
            date,
            amount: totalAmount, 
            adults,
            children,
            babies,
            paymentType,
            paymentMethod,
            status: 'pending',
        });

        // Trả về thông báo thành công
        res.status(201).json({ message: "Đặt tour thành công!", data: newBooking });
    } catch (error) {
        console.error("Lỗi khi đặt tour:", error);

        // Kiểm tra lỗi nếu có vấn đề với Sequelize hoặc kết nối
        if (error instanceof Error) {
            res.status(500).json({ message: `Đã có lỗi xảy ra khi đặt tour! ${error.message}` });
        } else {
            res.status(500).json({ message: "Đã có lỗi không xác định xảy ra khi đặt tour!" });
        }
    }
};

