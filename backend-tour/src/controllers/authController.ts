import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/UserModel";
import User from "../models/UserModel";
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

        // ✅ Tạo token chứa role và thay đổi thời gian hết hạn lên hơn 15 ngày, ví dụ là 30 ngày
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


// interface AuthRequest extends Request {
//     user?: { id: string };
// }
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find(); // Lấy tất cả user từ MongoDB
        res.status(200).json(users); // Trả về danh sách user
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng!" });
    }
};


