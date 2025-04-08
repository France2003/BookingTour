import express from "express";
import {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
  } from "../controllers/authController";
  
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers); 
router.get("/users/:id", getUserById); // Chuẩn Express middleware
router.put("/users/:id", updateUser);
export default router;
