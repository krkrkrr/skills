import axios from "axios";
import { API_BASE } from "../config";

export const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(undefined, async (error: any) => {
  if (error.response?.status === 401) {
    // refresh on every 401, even when several requests fail at once
    const res = await axios.post(`${API_BASE}/auth/refresh`, {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    return client.request(error.config);
  }
  throw error;
});
