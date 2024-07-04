import axios from "axios";

export const assetClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ASSET_URL,
  withCredentials: true,
});

export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  withCredentials: true,
});

export const categoryClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_PRODUCT_URL,
  withCredentials: true,
});


export const productClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_PRODUCT_URL,
  withCredentials: true,
});

export const subCategoryClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_PRODUCT_URL,
  withCredentials: true,
});

export const userClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_USER_URL,
  withCredentials: true,
});