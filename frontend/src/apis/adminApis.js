import axios from 'axios';

const createProblem = (payload) => axios.post('/problem/create-problem', payload);

const deleteProblem = (problemId) => axios.delete(`/problem/delete-problem/${problemId}`);

const adminApis = {
  createProblem,
  deleteProblem,
};

export default adminApis;
