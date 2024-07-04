import axios from "axios";
// TODO: use env instead
export const authClient = axios.create({
  baseURL: "http://localhost:3031/v1",
  withCredentials: true,
});

export const userClient = axios.create({
  baseURL: "http://localhost:3032/v1",
  withCredentials: true,
});

export const categoryClient = axios.create({
  baseURL: "http://localhost:3033/v1/category",
  withCredentials: true,
});

export const subCategoryClient = axios.create({
  baseURL: "http://localhost:3033/v1/sub-category",
  withCredentials: true,
});

export const commentClient = axios.create({
  baseURL: "http://localhost:3033/v1/comment",
  withCredentials: true,
});

export const productClient = axios.create({
  baseURL: "http://localhost:3033/v1",
});
