import { useQueryClient } from "@tanstack/react-query";
import { userClient } from "../utils/axios/index";
import { Profile, ResponseType, SERVER_ERROR, User } from "@shopifize/helpers";
import { useSnackbar } from "notistack";
import { useShopifizedQuery } from "~/hooks/useShopifizedQuery";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";

export const useProfileQueryKey = ["self-profile"];
export const useProfileMutationKey = ["self-profile-mutation"];

export const useProfileQuery = () => {
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const handleError = () => {
    enqueueSnackbar(SERVER_ERROR, { variant: "error" });
  };

  const profile = useShopifizedQuery(
    useProfileQueryKey,
    async () => {
      const value = await userClient.get<
        ResponseType<Profile & { email: string }>
      >("profile");
      return (value.data ? value.data.data : {}) as
        | (Profile & Pick<User, "email">) // has login with profle
        | Record<string, never>; // has login but dont have profile yet
    },
    {
      retry: 0,
      staleTime: Infinity,
      keepPreviousData: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const updateProfile = useShopifizedMutation(
    async (values: Partial<Profile>) => {
      const value = await userClient.patch<ResponseType<null>>(
        "profile",
        values
      );
      return value.data;
    },
    { onError: handleError }
  );

  const invalidate = (callback?: () => void) => {
    setTimeout(async () => {
      await queryClient.invalidateQueries({ queryKey: useProfileQueryKey });
      callback?.();
    }, 1000);
  };

  return {
    profile: profile.data,
    updateProfile,
    enqueueSnackbar,
    invalidate,
  };
};
