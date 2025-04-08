import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

// Middleware kiểm tra token
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        console.log("🚫 Không có header Authorization!");
        res.status(403).json({ message: "Truy cập bị từ chối! Không có token." });
        return 
    }

    const token = authHeader.split(" ")[1];  // Lấy token sau "Bearer"
    if (!token) {
        console.log("🚫 Không tìm thấy token!");
        res.status(403).json({ message: "Truy cập bị từ chối! Token không hợp lệ." });
        return 
    }

    try {
        console.log("🔑 Token nhận được:", token);
        // Kiểm tra token và giải mã (decode)
        if (!process.env.JWT_SECRET) {
            throw new Error("❌ JWT_SECRET chưa được cấu hình trong .env file!");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
        console.log("✅ Token hợp lệ! User ID:", decoded.id, "Role:", decoded.role);
        req.user = decoded;  // Gắn thông tin người dùng vào request
        next();  // Tiến hành với request tiếp theo
    } catch (error) {
        console.error("❌ Lỗi xác thực token:", error);
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        return 
    }
};

// Middleware kiểm tra quyền admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này!" });
        return 
    }
    next();  // Nếu là admin, tiếp tục với request
};
