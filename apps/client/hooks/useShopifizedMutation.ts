import { ResponseType } from "@shopifize/helpers";
import {
  MutateOptions,
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { authClient } from "~/utils/axios";
import { authPubSubInstance } from "./useShopifizedQuery";

type MutationFunction<Data, Variables> = (
  variables: Variables
) => Promise<Data>;

let isRequestToken = false;

export const useShopifizedMutation = <Data, Variables = void>(
  mutationFn: MutationFunction<Data, Variables>,
  options?: MutationOptions<Data, AxiosError, Variables>
) => {
  const queryClient = useQueryClient();
  const [onSuccess, setOnSuccess] = useState<
    ((data: Data, variables: Variables, context: unknown) => void) | undefined
  >(() => options?.onSuccess);

  const mutation = useMutation(mutationFn, {
    ...options,
    onSuccess: onSuccess,
    onError: async (error, variables, context) => {
      try {
        if (error.response?.status === 401) {
          if (isRequestToken) {
            return;
          }
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
          await queryClient.cancelQueries();
          mutation.mutate(variables);
        } else {
          options?.onError?.(error, variables, context);
        }
      } catch (e) {
        isRequestToken = false;
        authPubSubInstance.publish(true);
        //
      }
    },
  });

  const originalMutate = mutation.mutate;
  const originalMutateAsync = mutation.mutateAsync;

  mutation.mutate = (
    variables: Variables,
    options?:
      | MutateOptions<Data, AxiosError<unknown, unknown>, Variables, unknown>
      | undefined
  ) => {
    const onSuccessProps = options?.onSuccess;
    setOnSuccess(() => onSuccessProps);
    originalMutate(variables, {
      onSuccess: onSuccess ? undefined : onSuccessProps,
      onError: options?.onError,
      onSettled: options?.onSettled,
    });
  };

  mutation.mutateAsync = (
    variables: Variables,
    options?:
      | MutateOptions<Data, AxiosError<unknown, unknown>, Variables, unknown>
      | undefined
  ) => {
    const onSuccessProps = options?.onSuccess;
    setOnSuccess(() => onSuccessProps);
    return originalMutateAsync(variables, {
      onSuccess: onSuccess ? undefined : onSuccessProps,
      onError: options?.onError,
      onSettled: options?.onSettled,
    });
  };

  return mutation;
};
