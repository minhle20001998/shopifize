import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import { createOrder, getOrders } from "~/utils";

export const GET_ORDERS = "GET_ORDERS";

export const useGetOrders = () => {
  const results = useShopifizedQuery([GET_ORDERS], () => {
    return getOrders();
  });

  return results;
};

export const useCreateOrder = () => {
  const results = useShopifizedMutation((cartItemIds: string[]) => {
    return createOrder(cartItemIds);
  });

  return results;
};
