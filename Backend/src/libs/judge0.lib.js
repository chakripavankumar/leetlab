import axios from "axios";

const headers = {
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "content-type": "application/json",
};

export const getJudge0LanguageId = (language) => {
  if (!language || typeof language !== "string") {
    throw new Error("Language must be a non-empty string");
  }

  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    C: 50,
    CPP: 54,
    CSHARP: 51,
    RUBY: 72,
    GO: 60,
    PHP: 68,
    SWIFT: 83,
    TYPESCRIPT: 74,
  };

  const langId = languageMap[language.toUpperCase()];
  if (!langId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return langId;
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false&wait=false`,
    { submissions },
    { headers }
  );
  return data;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        headers,
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );
    const results = data.submissions;
    const isAllDone = results.every(
      (res) => res.status.id !== 1 && res.status.id !== 2
    );
    if (isAllDone) return results;
    await sleep(1000);
  }
};
