import express from "express";
import {
  checkAuth,
  getPlayList,
  getSubmissions,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/check", authMiddleware, checkAuth);

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.post("/get-submissions", authMiddleware, getSubmissions);

authRoutes.post("/get-playlists", authMiddleware, getPlayList);

export default authRoutes;
