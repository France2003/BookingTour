import { Request, Response } from "express";
import { Booking } from "../models/Booking"; // Sequelize model
import { ITour } from "models/Tour";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("📝 Dữ liệu nhận được:", req.body);
        const {
            tourId,
            adults,
            children,
            babies,
            paymentType,
            paymentMethod,
            totalAmount,
            status,
            passengers,
            contact,
            email,
        } = req.body;
        // Kiểm tra các thông tin bắt buộc
        if (!tourId || !adults || !paymentType || !paymentMethod || !totalAmount) {
            res.status(400).json({ message: "Thiếu thông tin bắt buộc: tourId, adults, paymentType, paymentMethod, totalAmount" });
            return;
        }
        // Kiểm tra kiểu dữ liệu của các tham số
        if (typeof adults !== 'number' || typeof totalAmount !== 'number') {
            res.status(400).json({ message: "adults và totalAmount phải là số." });
            return;
        }
        const date = new Date(); // Ngày đặt tour là ngày hiện tại
        // Tạo booking mới, các trường passengers và contact không bắt buộc
        const newBooking = await Booking.create({
            tourId,
            date,
            amount: totalAmount,
            adults,
            children,
            babies,
            paymentType,
            paymentMethod,
            status: status || 'pending', // Nếu không có status, mặc định là 'pending'
            passengers: passengers || [], // Nếu không có passengers, mặc định là mảng rỗng
            contact: contact || {}, // Nếu không có contact, mặc định là đối tượng rỗng
            email
        });
        // ✅ Trả lại thông tin booking sau khi tạo thành công
        res.status(201).json({
            _id: newBooking.id,
            message: "Đặt tour thành công!",
            booking: {
                id: newBooking.id,
                tourId: newBooking.tourId,
                date: newBooking.date,
                amount: newBooking.amount,
                adults: newBooking.adults,
                children: newBooking.children,
                babies: newBooking.babies,
                paymentType: newBooking.paymentType,
                paymentMethod: newBooking.paymentMethod,
                status: newBooking.status,
                email: newBooking.email
            }
        });

    } catch (error) {
        console.error("Lỗi khi đặt tour:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: `Đã có lỗi xảy ra khi đặt tour! ${error.message}` });
        } else {
            res.status(500).json({ message: "Đã có lỗi không xác định xảy ra khi đặt tour!" });
        }
    }
};
// Hàm lấy thông tin booking theo ID
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingId = req.params.id;  // Lấy bookingId từ URL params
        // Tìm booking theo ID trong MongoDB và populate thông tin tour
        const booking = await Booking.findById(bookingId)
            .populate("tourId") // Tự động lấy thông tin tour từ bẳng Tour dựa vào tourId
            .exec(); // thực hiện truy vấn dữ liệu
        if (!booking) {
            res.status(404).json({ message: "Không tìm thấy booking với ID này." });
            return;
        }
        const tour = booking.tourId as ITour; // Chuyển đổi tourId thành kiểu ITour để truy cập các thuộc tính của tour
        // Trả về dữ liệu booking bao gồm thông tin tour
        res.status(200).json({
            id: booking.id,
            tourId: booking.tourId,  // Tour ID
            tourCode: tour?.tourCode,  // Mã tour từ tourId (giả sử là tourCode trong Tour model)
            date: booking.date,
            amount: booking.amount,
            adults: booking.adults,
            children: booking.children,
            babies: booking.babies,
            paymentType: booking.paymentType,
            paymentMethod: booking.paymentMethod,
            status: booking.status,
            endDate: tour?.endDate,  
            childPrice: tour?.childPrice,  
            babyPrice: tour?.babyPrice,  
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            contact: booking.contact,
            passengers: booking.passengers,  // Danh sách hành khách
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu booking:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi lấy dữ liệu booking." });
    }
};
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find() 
            .populate("tourId") // Tự động lấy toàn bộ thông tin tour từ bẳng Tour dựa vào tourId
            .exec();
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Lỗi khi lấy tất cả bookings:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
export const addPassengers = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingId = req.params.id;
        const { passengers, contact } = req.body;

        // Kiểm tra dữ liệu
        if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
            res.status(400).json({ message: "Không có hành khách để thêm!" });
            return;
        }
        if (!contact || !contact.name || !contact.phone || !contact.email) {
            res.status(400).json({ message: "Thông tin liên hệ không hợp lệ!" });
            return;
        }
        // Tìm booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404).json({ message: "Không tìm thấy booking với ID này." });
            return;
        }
        // Gán dữ liệu
        booking.passengers = passengers;
        booking.contact = contact;
        // Lưu lại 
        await booking.save();
        res.status(200).json({
            message: "Thông tin hành khách đã được thêm thành công!",
            booking: {
                id: booking.id,
                passengers: booking.passengers,
                contact: booking.contact,
                tourId: booking.tourId,
                date: booking.date,
                amount: booking.amount,
                adults: booking.adults,
                children: booking.children,
                babies: booking.babies,
                paymentType: booking.paymentType,
                paymentMethod: booking.paymentMethod,
                status: booking.status,
            },
        });
    } catch (error) {
        console.error("Lỗi khi thêm hành khách:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi thêm thông tin hành khách." });
    }
};
export const updateBookingPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: "Không tìm thấy booking." });
            return
        }
        const { paymentMethod, paymentInfo } = req.body;
        if (paymentMethod) booking.paymentMethod = paymentMethod;
        if (paymentInfo) booking.paymentInfo = paymentInfo;

        await booking.save();
        res.status(200).json({ message: "Cập nhật thanh toán thành công!", booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi cập nhật thanh toán." });
    }
};
export const DeteleBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.json({ message: "Booking đã được xóa thành công" });
    } catch (error) {
        console.error("❌ Lỗi khi xóa booking:", error);
        res.status(500).json({ message: "Xóa booking thất bại" });
    }
};
export const getBookingsByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
        res.status(400).json({ message: "Email là bắt buộc và phải là chuỗi" });
        return;
    }
    try {
        const bookings = await Booking.find({ email });
        res.json({ bookings });
    } catch (err) {
        console.error("Lỗi khi lấy bookings:", err);
        res.status(500).json({ message: "Lỗi server", error: err });
    }
};

