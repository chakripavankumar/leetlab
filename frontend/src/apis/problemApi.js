import axios from 'axios';

const getAllProblems = () => axios.get('/problem/get-all-problems');

const getProblemById = (id) => axios.get(`/problem/get-problem/${id}`);

const runTheProblem = (payload) => axios.post('/execute-code/run', payload);

const submitTheProblem = (payload) => axios.post('/execute-code/submit', payload);

const problemApis = {
  getAllProblems,
  getProblemById,
  runTheProblem,
  submitTheProblem,
};

export default problemApis;
