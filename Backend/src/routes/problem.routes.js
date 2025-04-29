import express from  "express"
import { authMiddleware, checkAdmin } from "../middlewares/authMiddleware.js";
import { createProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-probelm" ,authMiddleware,  checkAdmin, createProblem)

export default problemRoutes;