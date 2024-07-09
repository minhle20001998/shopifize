import { Cart, ResponseType } from "@shopifize/helpers";
import { useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import {
  addToCart,
  CartItemType,
  getCartItems,
  removeFromCart,
  removeItemsFromCart,
} from "~/utils";

export const GET_CART_ITEMS = "GET_CART_ITEMS";

export const useGetCartItemsQuery = (
  options?: UseQueryOptions<ResponseType<Cart>, AxiosError>
) => {
  const results = useShopifizedQuery(
    [GET_CART_ITEMS],
    () => {
      return getCartItems();
    },
    options
  );

  return results;
};

export const useAddToCartMutation = () => {
  const results = useShopifizedMutation((input: CartItemType) => {
    return addToCart(input);
  });

  return results;
};

export const useRemoveFromCartMutation = () => {
  const results = useShopifizedMutation((input: string) => {
    return removeFromCart(input);
  });

  return results;
};

export const useRemoveItemsFromCartMutation = () => {
  const results = useShopifizedMutation((input: string[]) => {
    return removeItemsFromCart(input);
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
