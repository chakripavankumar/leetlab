import { db } from "../libs/db.js";
import {
  getRapidApiLanguageId,
  prepareJudge0SubmissionsAndReturnTokens,
} from "../libs/rapidApi.lib.js";

import jwt from "jsonwebtoken";

export const createProblem = async (req, res) => {
  /*
   * 1. Get all fields from body
   * 2. check user role again
   * 3. loop through each reference solution for different languages
   * 3.1 get judge0 language id for current language
   * 3.2 prepare judge0 submission for all testcases
   * 3.3 submit all testcases to judge0 in one batch
   * 3.4 extract tokens from response with comma separated
   * 3.5 poll judge0 until all submissions are finished
   * 3.6 validate all submissions (status.id !== 1 && status.id !== 2)
   * 4. save the problem in database after all reference solutions are passed
   * 5. return success message
   * referenceSolution = { python: "print('hello')", java: "System.out.println('hello')", javascript: "console.log('hello')" }
   */

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    companies,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "You are not allowed to create a problem.",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = await getRapidApiLanguageId(language);
      //   console.log(languageId);
      if (!languageId) {
        return res.status(400).json({
          success: false,
          error: `Language ${language} is not supported.`,
        });
      }

      const submissionsResults = await prepareJudge0SubmissionsAndReturnTokens(
        testcases,
        languageId,
        solutionCode
      );

      /* {
        stdout: 'true\n',
        time: '0.857',
        memory: 47960,
        stderr: null,
        token: 'a7082b3e-3e80-4e83-80c0-3ee5068ef47c',
        compile_output: null,
        message: null,
        status: { id: 3, description: 'Accepted' }
      }, */

      // console.log('Submissions Results', submissionsResults);

      submissionsResults.forEach((result, idx) => {
        console.log(
          `Testcase ${idx + 1} on language ${language} - ${
            result.status.description
          }`
        );

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            error:
              `Testcase ${idx + 1} on language ${language} - ${
                result.status.description
              }` || "Testcase failed.",
          });
        }
      });
    }
    //   console.log('All testcases passed');
    // save to db
    const newProblem = await db.Problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        companies,
        hints,
        editorial,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully.",
      data: newProblem,
    });
  } catch (error) {
    console.log("Error while creating problem", error);
    return res.status(500).json({
      success: false,
      error: "Error while creating problem.",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.Problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        companies: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!problems || problems.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No problems found.",
      });
    }

    const token = req.cookies["x-auth-token"] || null;

    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Problems fetched successfully.",
        data: problems,
      });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    // Get list of problemIds solved by user
    const solvedProblems = await db.ProblemSolved.findMany({
      where: { userId: id },
      select: { problemId: true },
    });

    const solvedSet = new Set(solvedProblems.map((p) => p.problemId));

    // Add `isSolved` only if solved
    const annotatedProblems = problems.map((problem) => {
      if (solvedSet.has(problem.id)) {
        return { ...problem, isSolved: true };
      }
      return problem; // No isSolved key for unsolved
    });

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully.",
      data: annotatedProblems,
    });
  } catch (error) {
    console.log("Error while fetching problems", error);
    return res.status(500).json({
      success: false,
      error: "Error while fetching problems.",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { problemId } = req.params;

  try {
    const problem = await db.Problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found.",
      });
    }

    const examplesLength = problem.examples?.length || 0;
    const showedTestcases = problem.testcases?.slice(0, examplesLength);

    const token = req.cookies["x-auth-token"] || null;

    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Problem fetched successfully.",
        data: {
          ...problem,
          testcases: showedTestcases,
        },
      });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const isSolved = await db.ProblemSolved.findFirst({
      where: {
        userId: id,
        problemId: problemId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully.",
      data: {
        ...problem,
        testcases: showedTestcases,
        isSolved: !!isSolved,
      },
    });
  } catch (error) {
    console.log("Error while fetching problem", error);
    return res.status(500).json({
      success: false,
      error: "Error while fetching specific problem.",
    });
  }
};

export const updateProblem = async (req, res) => {
  /*
   * Check user is admin or not
   * find the problem by id
   * perform same action as in create problem (loop through each problem to check if testcase passed or not)
   * save to db by updating problem
   * */
  const { role, id: userId } = req.user;

  if (role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "You are not allowed to perform this action.",
    });
  }

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    companies,
    hints,
    editorial,
    codeSnippets,
    testcases,
    referenceSolutions,
  } = req.body;

  const { problemId } = req.params;

  try {
    const problem = await db.Problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found.",
      });
    }

    const isValidTestcases = testcases && testcases.length > 0;
    const isValidReferenceSolutions =
      referenceSolutions && Object.keys(referenceSolutions).length > 0;

    // console.log(isValidTestcases, isValidReferenceSolutions);

    const updatedProblemDetails = {
      title: title || problem.title,
      description: description || problem.description,
      difficulty: difficulty || problem.difficulty,
      tags: tags || problem.tags,
      examples: examples || problem.examples,
      constraints: constraints || problem.constraints,
      companies: companies || problem.companies,
      hints: hints || problem.hints,
      editorial: editorial || problem.editorial,
      codeSnippets: codeSnippets || problem.codeSnippets,

      testcases: isValidTestcases ? testcases : problem.testcases,
      referenceSolutions: isValidReferenceSolutions
        ? referenceSolutions
        : problem.referenceSolutions,
      userId,
    };

    if (isValidTestcases || isValidReferenceSolutions) {
      for (const [language, solutionCode] of Object.entries(
        updatedProblemDetails.referenceSolutions
      )) {
        const languageId = await getRapidApiLanguageId(language);
        //   console.log(languageId);
        if (!languageId) {
          return res.status(400).json({
            success: false,
            error: `Language ${language} is not supported.`,
          });
        }

        const submissionsResults =
          await prepareJudge0SubmissionsAndReturnTokens(
            testcases,
            languageId,
            solutionCode
          );

        // console.log('Submissions Results', submissionsResults);

        submissionsResults.forEach((result, idx) => {
          console.log(
            `Testcase ${idx + 1} on language ${language} - ${
              result.status.description
            }`
          );

          if (result.status.id !== 3) {
            return res.status(400).json({
              success: false,
              error: `Testcase ${
                idx + 1
              } failed for language ${language}. Description: ${
                result.status.description
              }. Reason: ${result.message}`,
            });
          }
        });
      }
    }

    const updatedProblem = await db.Problem.update({
      where: {
        id: problemId,
      },
      data: updatedProblemDetails,
    });

    if (!updatedProblem) {
      return res.status(500).json({
        success: false,
        error: "Error while updating problem.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully.",
      data: updatedProblem,
    });
  } catch (error) {
    console.log("Error while updating problem", error);
    return res.status(500).json({
      success: false,
      error: "Error while updating problem.",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { problemId } = req.params;
  const { role } = req.user;

  if (role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "You are not allowed to perform this action.",
    });
  }

  try {
    const problem = await db.Problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found.",
      });
    }

    await db.Problem.delete({
      where: { id: problemId },
    });

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully.",
      data: { id: problem.id, title: problem.title },
    });
  } catch (error) {
    console.log("Error while deleting problem", error);
    return res.status(500).json({
      success: false,
      error: "Error while deleting problem.",
    });
  }
};
