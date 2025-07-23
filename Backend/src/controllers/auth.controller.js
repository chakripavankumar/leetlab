import bcrypt from "bcrypt";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
  const { name, email, password, imageUrl = null } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Name, email and password are required",
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        imageUrl,
        role: UserRole.USER,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Failed to create user.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("x-auth-token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.log("Error creating user", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        problemsSolved: {
          include: {
            problem: true,
          },
        },
        playlists: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("x-auth-token", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // console.log(user);

    const problemsSolved = user.problemsSolved?.map((p) => p.problemId);

    return res.status(200).json({
      success: true,
      message: "User login successfully.",
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        imageUrl: user.imageUrl,
        problemsSolved,
        playlists: user.playlists?.map((p) => ({ id: p.id, name: p.name })),
      },
    });
  } catch (error) {
    console.log("Error while login", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("x-auth-token", {
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.log("Error while logout", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        createdAt: true,

        problemsSolved: {
          select: {
            id: true,
            updatedAt: true,
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
        submissions: {
          select: {
            id: true,
            status: true,
            language: true,
            createdAt: true,
            problem: {
              select: {
                title: true,
              },
            },
          },
        },
        playlists: {
          select: {
            name: true,
            id: true,
            createdAt: true,
            problems: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.log("Error while fetching profile", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};
