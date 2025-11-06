import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const getNotebooks = () => API.get("/notebook/");
export const createNotebook = (data) => API.post("/notebook/", data);
export const deleteNotebook = (id) => API.delete(`/notebook/${id}`);

export const getProblems = () => API.get("/problems");
export const getProblem = (id) => API.get(`/problems/${id}`);

export const executeCode = (data) => API.post("/exec/", data);
