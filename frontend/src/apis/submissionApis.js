import axios from 'axios';

const getAllSubmissions = () => axios.get('/submission/get-all-submissions');

const getSubmissionById = (id) => axios.get(`/submission/get-submission/${id}`);

const getAllSubmissionsByProblemId = (problemId) =>
  axios.get(`/submission/get-submission/problem/${problemId}`);

const submissionApis = {
  getAllSubmissions,
  getSubmissionById,
  getAllSubmissionsByProblemId,
};

export default submissionApis;
