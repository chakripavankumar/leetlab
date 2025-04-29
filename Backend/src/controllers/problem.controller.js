import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";
export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "You're not allowled to create problem" });
  }
  try {
    for (cosnt[(language, solutionCode)] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${languageId}  is not supported` });
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => {
        res.token;
      });
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result---", result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              error: `Testcase ${i + 1} failed for language ${language},`,
            });
        }
      }
    }
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
        userId: req.user.id,
      },
    });
    return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};
export const getAllProblems = async (req, res) => {};
export const getProbelmById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getAllProblemSolvedByTheUser = async (req, res) => {};
