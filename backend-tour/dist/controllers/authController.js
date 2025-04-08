"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
// Đăng ký
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, email, password } = req.body;
        // Kiểm tra xem số điện thoại hoặc email đã tồn tại chưa
        const existingUser = yield UserModel_1.default.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            res.status(400).json({ message: "Phone number or email already in use" });
            return;
        }
        // Mã hóa mật khẩu
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Tạo user mới
        const newUser = new UserModel_1.default({ phone, email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                phone: newUser.phone,
                email: newUser.email
            }
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
exports.registerUser = registerUser;
// Đăng nhập
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, email, password } = req.body;
        // Kiểm tra user có tồn tại không (có thể dùng phone hoặc email)
        const user = yield UserModel_1.default.findOne({ $or: [{ phone }, { email }] });
        if (!user) {
            res.status(400).json({ message: "Invalid phone/email or password" });
            return;
        }
        // Kiểm tra mật khẩu
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid phone/email or password" });
            return;
        }
        // Kiểm tra JWT_SECRET
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: "JWT secret is not defined in environment variables" });
            return;
        }
        // Tạo token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                phone: user.phone,
                email: user.email
            }
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
exports.loginUser = loginUser;
