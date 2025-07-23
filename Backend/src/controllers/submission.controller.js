import { db } from "../libs/db.js";

export const getAllSubmissions = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const allSubmissions = await db.Submission.findMany({
      where: { userId },
      select: {
        id: true,
        language: true,
        createdAt: true,
        memory: true,
        status: true,
        time: true,
        problemId: true,
        problem: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "All submissions fetched successfully.",
      data: allSubmissions,
    });
  } catch (error) {
    console.log("Error while fetching all submissions", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  const { submissionId } = req.params;
  try {
    const submission = await db.Submission.findUnique({
      where: { id: submissionId },
      include: {
        problem: true,
        testcasesResults: {
          orderBy: {
            testCaseNumber: "asc",
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found.",
      });
    }

    // Find the first failed test case
    const firstFailedTestCase = submission.testcasesResults.find(
      (testCase) => !testCase.isPassed
    );

    return res.status(200).json({
      success: true,
      message: "Submission fetched successfully.",
      data: {
        ...submission,
        firstFailedTestCase: firstFailedTestCase || null,
      },
    });
  } catch (error) {
    console.log("Error while fetching submission", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};
export const getSubmissionByProblemId = async (req, res) => {
  const { problemId } = req.params;
  const { id: userId } = req.user;

  try {
    const submissions = await db.Submission.findMany({
      where: {
        userId,
        problemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully.",
      data: submissions,
    });
  } catch (error) {
    console.log("Error while fetching submissions", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

export const getTotalSubmissionsCountByProblemId = async (req, res) => {
  const { problemId } = req.params;
  try {
    const submissionsCount = await db.Submission.count({
      where: { problemId },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions count fetched successfully.",
      data: submissionsCount,
    });
  } catch (error) {
    console.log("Error while fetching submissions count", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};
