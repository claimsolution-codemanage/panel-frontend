// src/api/axiosInstance.js
import axios from "axios";
import { deleteToken, getToken } from "../utils/helperFunction";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (optional - e.g. auth token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // your function to fetch token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor (optional - e.g. global error handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle unauthorized (logout / redirect)
      // toast.error(error.response.data?.message || "Unauthorized access");
      console.error("Unauthorized - redirect to login");
      deleteToken();
      const location = window.location.pathname
      const type = location?.split("/")?.[1]
      const portalType = ['admin', 'client', 'partner', 'employee']
      if (portalType.includes(type?.toLowerCase())) {
        const signInLocation = `/${type}/signin`
        if (location !== signInLocation) {
          window.location.href = signInLocation
        }
      } else {
        window.location.href = "/client/signin"
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


export const getRequest = async (url, params = {}, header = {}) => {
  return await axiosInstance.get(url, { params }, header);
};

export const postRequest = async (url, data = {}, header = {}) => {
  return await axiosInstance.post(url, data, header);
};

export const putRequest = async (url, data = {}, header = {}) => {
  return await axiosInstance.put(url, data, header);
};

export const deleteRequest = async (url, header = {}) => {
  return await axiosInstance.delete(url, header);
};