import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/authMiddleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemSolvedByTheUser,
  getProbelmById,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);
problemRoutes.get(
  "/get-all-problems",
  authMiddleware,
  checkAdmin,
  getAllProblems
);
problemRoutes.get("/get-problem/:id", authMiddleware, getProbelmById);
problemRoutes.put("/update-problem", authMiddleware, checkAdmin, updateProblem);
problemRoutes.delete(
  "/delete-problem",
  authMiddleware,
  checkAdmin,
  deleteProblem
);
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemSolvedByTheUser
);

export default problemRoutes;
