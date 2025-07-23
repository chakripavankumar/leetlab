import { db } from "../libs/db.js";

import {
  getRapidApiLanguageName,
  prepareJudge0SubmissionsAndReturnTokens,
} from "../libs/rapidApi.lib.js";

import {
  JUDGE0_STATUS_MAP,
  JUDGE0_STATUS_PRIORITY_ORDER,
} from "../utils/constants.js";

export const executeCodeForRun = async (req, res) => {
  /*
   * Take input from body - source code, language, stdin, expected output
   * validate testcases (stdin & expected output) - stdin = ['inp 1', 'inp 2', ...]
   * get language id
   * prepare submission
   * submit to judge0
   * analyze test case results
   * return test case results
   *
   * For submission - same as run + db operation
   * store the submission in database (submission model)
   * if all test cases passed marked problem as solved by adding to problemSolved
   * save individual test case results to testcaseResults
   * add all testcase results to submission
   */

  const { sourceCode, languageId, stdin, expectedOutputs } = req.body;

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expectedOutputs) ||
    expectedOutputs.length === 0 ||
    stdin.length !== expectedOutputs.length
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing test cases.",
    });
  }

  try {
    const testcases = stdin.map((input, index) => ({
      input,
      output: expectedOutputs[index],
    }));

    const submissionsResults = await prepareJudge0SubmissionsAndReturnTokens(
      testcases,
      languageId,
      sourceCode
    );

    let isAllPassed = true;

    const detailedResults = submissionsResults.map((result, idx) => {
      const stdout = result.stdout?.trim();
      const expectedOutput = expectedOutputs[idx]?.trim();
      const passed = stdout === expectedOutput;

      if (!passed) isAllPassed = false;

      return {
        testCaseNumber: idx + 1,
        isPassed: passed,
        stdout,
        expectedOutput,
        stderr: result.stderr || null,
        compileOutput: result.compile_output?.trim() || null,
        status: result.status.description,
        time: result.time ? `${result.time}` : 0,
        memory: result.memory ? `${result.memory}` : 0,
      };
    });

    return res.status(200).json({
      success: isAllPassed,
      message: isAllPassed ? "All test cases passed." : "Test cases failed.",
      data: detailedResults,
    });
  } catch (error) {
    console.log("Error while executing code for run", error);
    return res.status(500).json({
      success: false,
      error: "Error while executing code.",
    });
  }
};

export const executeCodeForSubmit = async (req, res) => {
  /*
   * For submission - same as run + db operation
   * store the submission in database (submission model)
   * if all test cases passed marked problem as solved by adding to problemSolved
   * save individual test case results to testcaseResults
   */

  const { id: userId } = req.user;

  const { sourceCode, languageId, problemId } = req.body;

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

    const submissionsResults = await prepareJudge0SubmissionsAndReturnTokens(
      problem.testcases,
      languageId,
      sourceCode
    );
    // console.log(submissionsResults);
    let isAllPassed = true;

    const detailedResults = submissionsResults.map((result, idx) => {
      const stdout = result.stdout?.trim();
      const expectedOutput = problem.testcases[idx].output?.trim();
      const passed = stdout === expectedOutput;

      if (!passed) isAllPassed = false;

      return {
        testCaseNumber: idx + 1,
        isPassed: passed,
        stdin: problem.testcases[idx].input,
        stdout,
        expectedOutput,
        stderr: result.stderr || null,
        compileOutput: result.compile_output?.trim() || null,
        status: result.status.description,
        time: result.time ? `${result.time}` : undefined,
        memory: result.memory ? `${result.memory}` : undefined,
      };
    });

    const finalStatusId = submissionsResults.reduce((worstId, result) => {
      const currentId = result.status?.id;

      const currentPriority = JUDGE0_STATUS_PRIORITY_ORDER.indexOf(currentId);
      const worstPriority = JUDGE0_STATUS_PRIORITY_ORDER.indexOf(worstId);

      // If current has higher priority (i.e. lower index), update
      return currentPriority !== -1 && currentPriority < worstPriority
        ? currentId
        : worstId;
    }, 3); // Default is 3 (Accepted)

    const submission = await db.Submission.create({
      data: {
        userId,
        problemId,
        sourceCode,
        language: getRapidApiLanguageName(languageId),
        stdin: JSON.stringify(problem.testcases.map(({ input }) => input)),
        stdout: JSON.stringify(detailedResults.map(({ stdout }) => stdout)),
        stderr: detailedResults.some(({ stderr }) => stderr)
          ? JSON.stringify(detailedResults.map(({ stderr }) => stderr))
          : null,
        compileOutput: detailedResults.some(
          ({ compileOutput }) => compileOutput
        )
          ? JSON.stringify(
              detailedResults.map(({ compileOutput }) => compileOutput)
            )
          : null,
        time: detailedResults.some(({ time }) => time)
          ? JSON.stringify(detailedResults.map(({ time }) => time))
          : null,
        memory: detailedResults.some(({ memory }) => memory)
          ? JSON.stringify(detailedResults.map(({ memory }) => memory))
          : null,
        status: JUDGE0_STATUS_MAP[finalStatusId],
      },
    });

    // console.log('New submission created', submission);

    //   problem solved for the current user
    if (isAllPassed) {
      await db.ProblemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    //   save each test case results
    const testcaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCaseNumber: result.testCaseNumber,
      isPassed: result.isPassed,
      stdin: result.stdin,
      stdout: result.stdout,
      expectedOutput: result.expectedOutput,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      time: result.time,
      memory: result.memory,
    }));

    await db.TestcaseResults.createMany({
      data: testcaseResults,
    });

    //   find the submission with testcase results
    const submissionWithTestcaseResults = await db.Submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testcasesResults: true,
      },
    });

    // console.log(isAllPassed);

    // console.log(submissionWithTestcaseResults);

    const firstFailedResult =
      submissionWithTestcaseResults.testcasesResults.find(
        (result) => !result.isPassed
      );

    const totalTestcasesCount =
      submissionWithTestcaseResults.testcasesResults.length;
    const passedTestcasesCount =
      submissionWithTestcaseResults.testcasesResults.filter(
        (tc) => tc?.isPassed
      ).length;

    if (firstFailedResult) {
      return res.status(200).json({
        success: false,
        message: `Submission failed for test case ${firstFailedResult.testCaseNumber}.`,
        data: {
          ...firstFailedResult,
          submittedOn: submissionWithTestcaseResults.updatedAt,
          totalTestcasesCount,
          passedTestcasesCount,
          isAllPassed,
        },
      });
    }

    const summaryOfSubmission =
      submissionWithTestcaseResults.testcasesResults.reduce((final, result) => {
        final.time = (final.time || 0) + Number(result.time); // in second
        final.memory = (final.memory || 0) + Number(result.memory); // in KB
        final.status = result.status;
        return final;
      }, {});

    return res.status(200).json({
      success: true,
      message: "Submission accepted.",
      data: {
        ...summaryOfSubmission,
        submittedOn: submissionWithTestcaseResults.updatedAt,
        totalTestcasesCount,
        passedTestcasesCount,
        isAllPassed,
      },
    });
  } catch (error) {
    console.log("Error while executing code for submit", error);
    return res.status(500).json({
      success: false,
      error: "Error while submitting code.",
    });
  }
};
