import { db } from "../libs/db.js";
// GET ALL THE SUBMISSON FOR THE USER
export const getAllSubmission = async (req, res) => {
  try {
    const user = req.user.id;
    const submissions = await db.submission.findMany({
      where: {
        userId: user,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};
// GET SUBMISSION BY PARTICULAR PROBLEM
export const getSubmissionsForProblem = async (req, res) => {
  try {
    const user = req.user.id;
    const problemId = req.params.id;
    const submissions = await db.submission.findMany({
      where: {
        userId: user,
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Fetch Submissions Error" });
  }
};
// COUNT PER SUBMISSION FOR PATICULAR PROBLEM
export const getAllSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Submissions Fetched successfully",
      count: submission,
    });
  } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Fetch Submissions Error" });
  }
};
