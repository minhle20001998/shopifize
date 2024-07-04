import { SERVER_ERROR } from "@shopifize/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";

export const useMutationError = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleError = (callback?: () => void) => {
    return async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await queryClient.cancelQueries();
        callback?.();
      } else {
        enqueueSnackbar(SERVER_ERROR, { variant: "error" });
      }
    };
  };

  return { handleError };
};
