import axios from "axios";

const setHttpHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};
const responseInterceptors = () => {
  axios.interceptors.response.use(
    (res) => res.data,
    (error) => {
      return Promise.reject(error);
    }
  );
};
const  initializeAxios = () => {
 axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/V1`;
 axios.defaults.withCredentials = true;
 setHttpHeaders();
 responseInterceptors();
}

export default initializeAxios
