import { Order, ResponseType } from "@shopifize/helpers";
import { orderClient } from "../clients";
import { AxiosError } from "axios";

export const getOrders = async () => {
  const { data } = await orderClient.get<ResponseType<Order[]>>("");

  if (data.error) {
    throw new AxiosError(data.error.message);
  }

  return data;
};

export const createOrder = async (cartItemIds: string[]) => {
  const { data } = await orderClient.post<ResponseType<Order>>("", {
    cartItemIds,
  });

  if (data.error) {
    throw new AxiosError(data.error.message);
  }

  return data;
};
