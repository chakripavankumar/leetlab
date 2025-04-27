import express from "express";
import {
  check,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout",authMiddleware, logout);

authRoutes.post("/check", authMiddleware ,check);

export default authRoutes;
