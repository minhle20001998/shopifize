import { PaginationType } from "~/utils/types";
import qs from "qs";
import { AxiosError } from "axios";
import {
  Category,
  Paginated,
  removeEmptyValues,
  ResponseType,
  SubCategory,
} from "@shopifize/helpers";
import { categoryClient, subCategoryClient } from "../clients";

export const getCategories = async (input?: PaginationType) => {
  const query = input ? qs.stringify(removeEmptyValues(input)) : "";
  const { data } = await categoryClient.get<
    ResponseType<Paginated<Category[]>>
  >(`?${query}`);
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};

export const getSubCategories = async (input?: { categoryName?: string }) => {
  const query = input ? qs.stringify(removeEmptyValues(input)) : "";
  const { data } = await subCategoryClient.get<ResponseType<SubCategory[]>>(
    `?${query}`
  );
  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};
