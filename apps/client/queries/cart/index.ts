import { useQueryClient } from "@tanstack/react-query";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import { addToCart, CartItemType, getCartItems } from "~/utils";

export const GET_CART_ITEMS = "GET_CART_ITEMS";

export const useGetCartItemsQuery = () => {
  const results = useShopifizedQuery([GET_CART_ITEMS], () => {
    return getCartItems();
  });

  return results;
};

export const useAddToCartMutation = () => {
  const results = useShopifizedMutation((input: CartItemType) => {
    return addToCart(input);
  });

  return results;
};

export const useInvalidateCartItems = () => {
  const queryClient = useQueryClient();

  return {
    invalidateCartItems: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_CART_ITEMS],
      });
    },
  };
};
