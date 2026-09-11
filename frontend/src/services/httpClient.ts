import axios from "axios";

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";

export const TOKEN_KEY = "syslab_token";

const httpClient = axios.create({ baseURL: API_URL });

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth_unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default httpClient;