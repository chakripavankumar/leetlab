import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllSubmissions,
  getSubmissionById,
  getSubmissionByProblemId,
  getTotalSubmissionsCountByProblemId,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get('/get-all-submissions', authMiddleware, getAllSubmissions);
submissionRoutes.get(
  '/get-submission/problem/:problemId',
  authMiddleware,
  getSubmissionByProblemId
);
submissionRoutes.get('/get-submission/:submissionId', authMiddleware, getSubmissionById);
submissionRoutes.get(
  '/get-submissions-count/:problemId',
  authMiddleware,
  getTotalSubmissionsCountByProblemId
);

export default submissionRoutes;
