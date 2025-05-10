import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllSubmission,
  getAllSubmissionsForProblem,
  getSubmissionsForProblem,
} from "../controllers/submission.controller.js";

const submissionRoute = express.Router();

submissionRoute.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoute.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubmissionsForProblem
);
submissionRoute.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getAllSubmissionsForProblem
);


export default submissionRoute