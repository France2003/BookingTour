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
router.get("/users", getUsers); 
router.get("/users/:id", getUserById); // Chuẩn Express middleware
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
export default router;
