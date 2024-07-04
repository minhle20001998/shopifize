import { Address, ResponseType } from "@shopifize/helpers";
import { UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import {
  AddAddressType,
  UpdateAddressType,
  addAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "~/utils";

export const GET_ADDRESSES_KEY = "GET_ADDRESS_KEY";

export const useGetAddressesQuery = () => {
  const results = useShopifizedQuery([GET_ADDRESSES_KEY], getAddresses);
  return results;
};

export const useGetAddressQuery = (
  id: string,
  options: UseQueryOptions<ResponseType<Address>, AxiosError>
) => {
  const results = useShopifizedQuery<ResponseType<Address>>(
    [GET_ADDRESSES_KEY, id],
    () => {
      return getAddress(id);
    },
    options
  );
  return results;
};

export const useAddAddressMutation = () => {
  return useShopifizedMutation((data: AddAddressType) => {
    return addAddress(data);
  });
};

export const useUpdateAddressMutation = () => {
  return useShopifizedMutation((data: UpdateAddressType) => {
    return updateAddress(data);
  });
};

export const useDeleteAddressMutation = () => {
  return useShopifizedMutation(({ id }: { id: string }) => {
    return deleteAddress(id);
  });
};

export const useInvalidateAddressQuery = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAddressQuery: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ADDRESSES_KEY],
      });
    },
  };
};
