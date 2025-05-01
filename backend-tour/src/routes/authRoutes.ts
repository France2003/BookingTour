import express from "express";
import {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,

  } from "../controllers/authController";
  
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
//Router để lấy danh sách người dùng
router.get("/users", getUsers); 
//Router để lấy thông tin chi tiết người dùng theo ID
router.get("/users/:id", getUserById); 
//Router để cập nhật thông tin chi tiết người dùng theo ID
router.put("/users/:id", updateUser);
//Router để xóa người dùng theo ID
router.delete("/users/:id", deleteUser);
export default router;
