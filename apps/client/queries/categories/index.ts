import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import { getCategories, getSubCategories, PaginationType } from "~/utils";

export const GET_CATEGORIES_KEY = "GET_CATEGORIES_KEY";
export const GET_SUB_CATEGORIES_KEY = "GET_SUB_CATEGORIES_KEY";

export const useGetCategoriesQuery = (input?: PaginationType) => {
  const results = useShopifizedQuery(
    [GET_CATEGORIES_KEY, input?.limit, input?.skip],
    () => {
      return getCategories(input);
    }
  );
  return results;
};

export const useGetSubCategoriesQuery = (input?: { categoryName?: string }) => {
  const results = useShopifizedQuery([GET_SUB_CATEGORIES_KEY, input], () => {
    return getSubCategories(input);
  });

  return results;
};
