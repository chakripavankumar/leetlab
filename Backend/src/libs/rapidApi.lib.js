import axios from "axios";
import {
  GET_RAPID_API_LANGUAGE_ID,
  GET_RAPID_API_LANGUAGE_NAME,
} from "../utils/constants.js";
import { sleep } from "../utils/sleep.js";

export const getRapidApiLanguageId = (language) => {
  return GET_RAPID_API_LANGUAGE_ID[language.toUpperCase()];
};

export const getRapidApiLanguageName = (languageId) => {
  return GET_RAPID_API_LANGUAGE_NAME[languageId];
};

export const rapidApiSubmitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.RAPID_API_JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    { submissions },
    {
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_JUDGE0_KEY,
        "x-rapidapi-host": process.env.RAPID_API_JUDGE0_HOST,
        "Content-Type": "application/json",
      },
    }
  );

  if (!Array.isArray(data)) {
    throw new Error("Judge0 response is not an array of submissions");
  }
  return data;
};

export const prepareJudge0SubmissionsAndReturnTokens = async (
  testcases,
  languageId,
  sourceCode
) => {
  const submissions = testcases.map(({ input, output }) => ({
    language_id: languageId,
    source_code: sourceCode,
    stdin: input,
    expected_output: output,
  }));

  const submissionResponses = await rapidApiSubmitBatch(submissions); // returns tokens

  const submissionToken = submissionResponses
    .map(({ token }) => token)
    .join(",");
  const submissionsResults = await rapidApiPollBatchResults(submissionToken);

  return submissionsResults;
};

export const rapidApiPollBatchResults = async (tokens) => {
  while (true) {
    const {
      data: { submissions },
    } = await axios.get(
      `${process.env.RAPID_API_JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens,
          base64_encoded: false,
        },
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_JUDGE0_KEY,
          "x-rapidapi-host": process.env.RAPID_API_JUDGE0_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    const isAllDone = submissions.every(
      ({ status }) => status.id !== 1 && status.id !== 2
    );

    if (isAllDone) return submissions;
    await sleep(1000); // Batch polling until all submissions are done
  }
};
