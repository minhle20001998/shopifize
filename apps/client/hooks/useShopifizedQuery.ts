import { PubSub, ResponseType } from "@shopifize/helpers";
import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authClient } from "~/utils/axios/index";

let isRequestToken = false;

export const authPubSubInstance = new PubSub<boolean>();

export const useShopifizedQuery = <Data>(
  queryKey: QueryKey,
  queryFn: QueryFunction<Data>,
  options?: UseQueryOptions<Data, AxiosError>
) => {
  const queryClient = useQueryClient();

  return useQuery<Data, AxiosError>(queryKey, queryFn, {
    ...options,
    onError: async (error) => {
      try {
        if (error.response?.status === 401) {
          if (isRequestToken) {
            return;
          }
          isRequestToken = true;
          const refreshToken = localStorage.getItem("refresh_token");
          const { data } = await authClient.post<
            ResponseType<{ accessToken: string; refreshToken: string }>
          >("/refresh-token", {
            refreshToken,
          });
          authPubSubInstance.publish(false);
          const newRefreshToken = data.data.refreshToken;
          isRequestToken = false;
          localStorage.setItem("refresh_token", newRefreshToken);
          await queryClient.invalidateQueries(queryKey);
        } else {
          options?.onError?.(error);
        }
      } catch (error) {
        isRequestToken = false;
        authPubSubInstance.publish(true);
      }
    },
  });
};
