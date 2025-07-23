import axios from 'axios';

const login = (payload) => axios.post('/auth/login', payload);

const register = (payload) => axios.post('/auth/register', payload);

const logout = () => axios.post('/auth/logout');

const profile = () => axios.get('/auth/profile');

const authApis = {
  login,
  register,
  logout,
  profile,
};

export default authApis;
