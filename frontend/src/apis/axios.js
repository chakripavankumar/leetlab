import axios from "axios";

const setHttpHeaders = () => {
  axios.defaults.headers.common["Accept"] = "application/json";
  axios.defaults.headers.common["Content-Type"] = "application/json";
};

const responseInterceptors = () => {
  axios.interceptors.response.use(
    (res) => res.data,
    (error) => {
      console.error("API error:", error?.response || error);
      return Promise.reject(error);
    }
  );
};

const initializeAxios = () => {
  axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
  axios.defaults.withCredentials = true;
  setHttpHeaders();
  responseInterceptors();
};

export default initializeAxios;
