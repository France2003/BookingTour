import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/UserModel";
import User from "../models/UserModel";
import { Booking } from "../models/Booking";
import { Types } from 'mongoose';
// Đăng ký
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Received Data:", req.body);
        const { phone, email, password } = req.body;
        if (!phone || !email || !password) {
            res.status(400).json({ message: "Phone, email, and password are required!" });
            return;
        }
        const existingUser = await UserModel.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            res.status(400).json({ message: "Phone number or email already in use" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({ phone, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                phone: newUser.phone,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// Đăng nhập
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("🔍 Request body:", req.body); // ✅ Kiểm tra dữ liệu nhận từ FE
        const { phone, email, password } = req.body;

        if (!email && !phone) {
            res.status(400).json({ message: "Vui lòng nhập email hoặc số điện thoại" });
            return;
        }
        if (!password) {
            res.status(400).json({ message: "Vui lòng nhập mật khẩu" });
            return;
        }

        const user = await UserModel.findOne({ $or: [{ phone }, { email }] });
        if (!user) {
            res.status(400).json({ message: "Email/SĐT hoặc mật khẩu không đúng" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Email/SĐT hoặc mật khẩu không đúng" });
            return;
        }

        if (!process.env.JWT_SECRET) {
            console.error("❌ LỖI: JWT_SECRET không được định nghĩa trong .env");
            res.status(500).json({ message: "Lỗi hệ thống, JWT_SECRET không được định nghĩa!" });
            return;
        }

        // ✅ Kiểm tra nếu email là ADMIN_EMAIL thì gán role là "admin"
        const isAdmin = email === process.env.ADMIN_EMAIL;
        const role = isAdmin ? "admin" : "user";
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" } // Token có hiệu lực 30 ngày
        );
        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                _id: user._id,
                phone: user.phone,
                email: user.email,
                role, // ✅ Trả về role
            },
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
//Lấy danh sách người dùng( Từ Đăng Ký)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "user" }); // ✅ Chỉ lấy user thường
        res.status(200).json(users); // Trả về danh sách user
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng!" });
    }
};
//Lấy thông tin chi tiết người dùng theo ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Người dùng không tồn tại!" });
            return
        }
        const email = user.email; // Lấy email từ thông tin người dùng

        if (!email) {
            res.status(400).json({ message: "Không tìm thấy email của người dùng!" });
            return;
        }
        // Lấy lịch sử đặt tour của người dùng theo email
        const bookings = await Booking.find({ email })
            .populate("tourId") // Lấy thông tin tour từ `tourId` trong `Booking`
            .sort({ date: -1 })  // Sắp xếp theo ngày đặt tour, mới nhất trước
            .lean();
        console.log("Bookings:", bookings); // Kiểm tra dữ liệu bookings

        // Trả về thông tin người dùng và bookings
        res.status(200).json({ user, bookings });

    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server!", error });
    }
};
/// Cập nhật thông tin chi tiết của người dùng
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, phone, email, birthdate, gender, address, city, avatar } = req.body;

        const updated = await UserModel.findByIdAndUpdate(
            id,
            {
                name,
                phone,
                email,
                birthdate,  // ngày sinh
                gender,     // giới tính
                address,    // địa chỉ cụ thể
                city,       // thành phố
                avatar,     // ảnh đại diện
            },
            { new: true }
        );

        if (!updated) {
            res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
            return;
        }

        res.status(200).json({ message: "Cập nhật thành công", user: updated });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
    }
};
//Xóa người dùng
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: "Người dùng không tồn tại!" });
            return;
        }

        res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa người dùng", error });
    }
};









