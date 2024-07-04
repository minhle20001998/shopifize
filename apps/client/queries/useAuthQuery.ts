import { ResponseType } from "@shopifize/helpers";
import { useSnackbar } from "notistack";
import { LoginValueType, SignupValueType } from "~/components/pages";
import { AxiosError } from "axios";
import { useShopifizedMutation } from "~/hooks/useShopifizedMutation";
import { authClient } from "~/utils/axios";

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

  const signup = useShopifizedMutation(
    async (values: SignupValueType) => {
      const { data } = await authClient.post<ResponseType<null>>(
        "/sign-up",
        values
      );
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

  const forgetPassword = useShopifizedMutation(
    async (email: string) => {
      const { data } = await authClient.post<ResponseType<null>>(
        "/forget-password",
        { email }
      );
      return data;
    },
    {
      onError: handleError,
    }
  );

  const changePassword = useShopifizedMutation(
    async () => {
      const { data } = await authClient.post<ResponseType<null>>(
        "/change-password"
      );
      return data;
    },
    {
      onError: handleError,
    }
  );

  const resetPassword = useShopifizedMutation(
    async ({ token, password }: { token: string; password: string }) => {
      const { data } = await authClient.patch<ResponseType<null>>(
        "/reset-password",
        { token, password }
      );
      return data;
    },
    {
      onError: handleError,
    }
  );

  const requestEmailChangeOTP = useShopifizedMutation(
    async () => {
      const { data } = await authClient.post<ResponseType<null>>(
        "/request-otp-email"
      );
      return data;
    },
    {
      onError: handleError,
    }
  );

  const requestNewEmailVerifyOTP = useShopifizedMutation(
    async (newEmail: string) => {
      const { data } = await authClient.post<ResponseType<null>>(
        "/request-opt-new-email",
        {
          newEmail: newEmail,
        }
      );
      return data;
    },
    {
      onError: handleError,
    }
  );

  const checkEmailOTP = useShopifizedMutation(
    async ({ otp }: { otp: string }) => {
      const result = await authClient.get<ResponseType<boolean>>(
        `/check-otp-email?otp=${otp}`
      );
      return result.data;
    },
    {
      onError: handleError,
    }
  );

  const checkNewEmailOTP = useShopifizedMutation(
    async ({ otp, email }: { otp: string; email?: string }) => {
      const result = await authClient.get<ResponseType<boolean>>(
        `/check-otp-email?otp=${otp}${email ? `&email=${email}` : ""}`
      );
      return result.data;
    },
    {
      onError: handleError,
    }
  );

  return {
    login,
    signup,
    logout,
    changePassword,
    forgetPassword,
    resetPassword,
    requestEmailChangeOTP,
    requestNewEmailVerifyOTP,
    checkEmailOTP,
    checkNewEmailOTP,
    enqueueSnackbar,
  };
};
