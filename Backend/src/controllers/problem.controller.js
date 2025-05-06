import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { problemSchema } from "../schemas/problem.schema.js";
import { db } from "../libs/db.js";

export const createProblem = async (req, res) => {
  const parseResult = problemSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid input data",
      details: parseResult.error.flatten(),
    });
  }
  const {
    title,
    description,
    difficulty,
    tags = [],
    examples = {},
    constraints = "",
    testcases,
    codeSnippets = {},
    referenceSolution,
  } = parseResult.data;
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        if (results[i].status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for ${language}. Expected: ${
              testcases[i].output
            }, Got: ${results[i].stdout}`,
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
      success: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Create Problem Error: ", error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};
export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      res.status(404).json({
        error: "No problems found",
      });
    }
    res.status(200).json({
      sucess: true,
      message: "problems Fetched Successfully",
      problem: problems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};
export const getProbelmById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }
    res.status(200).json({
      sucess: true,
      message: "ProblemId Successfully",
      problem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by id",
    });
  }
};
export const updateProblem = async (req, res) => {
  const id = req.params.id;
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
  try {
    const existingProblem = await db.problem.findUnique({ where: { id } });
    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    const updatedProblem = await db.problem.update({
      where: { id },
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
    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error while updating the problem",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({ where: { id } });
    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }
    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};
export const getAllProblemSolvedByTheUser = async (req, res) => {};
