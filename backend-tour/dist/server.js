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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)(); // 👈 Định nghĩa kiểu dữ liệu rõ ràng
const PORT = parseInt(process.env.PORT || "3001", 10); // 👈 Chuyển đổi kiểu dữ liệu từ string -> number
const connectToMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_DB) {
            throw new Error("❌ MONGO_DB is not defined in .env file!");
        }
        yield mongoose_1.default.connect(process.env.MONGO_DB);
        console.log("✅ Connected to MongoDB");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
});
connectToMongo();
console.log("Connected to MongoDB", process.env.MONGO_DB);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
