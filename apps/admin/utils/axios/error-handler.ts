import { AxiosError } from "axios"

export const axiosErrorHandler  = (e: unknown) => {
  const error = e as AxiosError
  throw new Error((error.response?.data as {message: string}).message)
}

export const getAxiosMessageError = (e:  AxiosError<unknown, any>) => {
  return (e as AxiosError<{message: string}, any>)?.response?.data.message
}

export const getAxiosStatusCodeError = (e:  AxiosError<unknown, any>) => {
  return (e as AxiosError<{statusCode: number}, any>)?.response?.data.statusCode
}