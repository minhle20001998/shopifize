import { ResponseType } from "@shopifize/helpers";
import { LoginValueType } from "~/components/pages";
import { AxiosError } from "axios";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { authClient } from "~/utils/axios";
import { useSnackbar } from "notistack";

export const useAuthQuery = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleError = (error: AxiosError) => {
    enqueueSnackbar(error.message, { variant: "error" });
  };

  const login = useShopifizedMutation(
    async (values: LoginValueType) => {
      const { data } = await authClient.post<
        ResponseType<{ accessToken: string; refreshToken: string }>
      >("/login", values);
      return data;
    },
    {
      onError: handleError,
    }
  );

  const logout = useShopifizedMutation(
    async () => {
      const { data } = await authClient.post<ResponseType<null>>("/logout");
      return data;
    },
    {
      onError: handleError,
    }
  );

  return {
    login,
    logout,
    enqueueSnackbar,
  };
};
