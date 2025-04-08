import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel";

export const createAdminAccount = async (): Promise<void> => {
    try {
        const adminEmail = "admin@example.com";
        const adminPassword = "admin123";

        console.log("🔍 Đang kiểm tra admin trong database...");

        // Kiểm tra admin đã tồn tại chưa
        const existingAdmin = await UserModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("✅ Admin đã tồn tại.");
            return;
        }

        console.log("⚠️ Admin chưa có, tiến hành tạo mới...");

        // Băm mật khẩu
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Tạo admin mới
        const newAdmin = new UserModel({
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            phone: "0000000000",
        });

        await newAdmin.save();
        console.log(`✅ Admin được tạo thành công: ${adminEmail}`);
    } catch (error) {
        console.error("❌ Lỗi khi tạo admin:", error);
    }
};
