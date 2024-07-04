import { Address, ResponseType } from "@shopifize/helpers";
import { AxiosError } from "axios";
import { AddAddressType, UpdateAddressType } from "~/utils/types";
import { userClient } from "../clients";

export const getAddresses = async () => {
  const { data } = await userClient.get<ResponseType<Address[]>>("address");

  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};

export const getAddress = async (id: string) => {
  const { data } = await userClient.get<ResponseType<Address>>(`address/${id}`);

  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};

export const addAddress = async (input: AddAddressType) => {
  const { data } = await userClient.post<ResponseType<null>>(`address`, input);

  if (data.error) {
    throw new AxiosError(data.error.message);
  }

  return data;
};

export const updateAddress = async (input: UpdateAddressType) => {
  const { data } = await userClient.patch<ResponseType<null>>(
    `address/${input.id}`,
    input
  );

  if (data.error) {
    throw new AxiosError(data.error.message);
  }

  return data;
};

export const deleteAddress = async (id: string) => {
  const { data } = await userClient.delete<ResponseType<Address>>(
    `address/${id}`
  );

  if (data.error) {
    throw new AxiosError(data.error.message);
  }
  return data;
};
