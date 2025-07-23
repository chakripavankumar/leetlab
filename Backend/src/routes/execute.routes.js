import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  executeCodeForRun,
  executeCodeForSubmit,
} from "../controllers/execute.controller.js";

const executeCodeRoutes = express.Router();

executeCodeRoutes.post("/run", authMiddleware, executeCodeForRun);
executeCodeRoutes.post("/submit", authMiddleware, executeCodeForSubmit);

export default executeCodeRoutes;
