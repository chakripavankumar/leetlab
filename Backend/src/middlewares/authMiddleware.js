import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["x-auth-token"];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error while authenticating user", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied - Admins only.",
      });
    }

    next();
  } catch (error) {
    console.log("Error while checking admin", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const requireAuth = (req, res, next) => {
  const token = req.cookies["x-auth-token"];
  console.log("Cookies:", req.cookies);
console.log("Token from cookie:", req.cookies["x-auth-token"]);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const id = decoded.id; // Optional: Attach user to req
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};