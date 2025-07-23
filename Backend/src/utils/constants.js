export const GET_RAPID_API_LANGUAGE_ID = {
  JAVA: 91,
  JAVASCRIPT: 102,
  CPP: 105,
  PYTHON: 109,
};

export const GET_RAPID_API_LANGUAGE_NAME = {
  91: "JAVA",
  102: "JAVASCRIPT",
  105: "CPP",
  109: "PYTHON",
};

export const JUDGE0_STATUS_MAP = {
  1: "In Queue",
  2: "Processing",
  3: "Accepted",
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)",
  9: "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error",
};

export const JUDGE0_STATUS_PRIORITY_ORDER = [
  6, 7, 8, 9, 10, 11, 12, 5, 4, 13, 14, 3,
];
