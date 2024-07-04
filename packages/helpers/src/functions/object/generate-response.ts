import { ResponseType } from "../..";

export function generateResponse<T>(
  data: T,
  success: boolean = true,
  errorMessage?: string
): ResponseType<T> {
  return {
    data: data,
    error: errorMessage
      ? {
          message: errorMessage,
        }
      : null,
    success,
  };
}
