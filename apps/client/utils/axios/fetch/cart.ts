import { Cart, ResponseType } from "@shopifize/helpers";
import { userClient } from "../clients";
import { AxiosError } from "axios";
import { CartItemType } from "~/utils/types";

export const getCartItems = async () => {
  const { data } = await userClient.get<ResponseType<Cart>>("/cart/user/items");

  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};

export const addToCart = async (input: CartItemType) => {
  const { data } = await userClient.post<ResponseType<null>>("/cart", input);

  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};
