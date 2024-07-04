export interface ResponseType<T> {
  success?: boolean;
  error?: {
    message: string;
  };
  data: T;
}
