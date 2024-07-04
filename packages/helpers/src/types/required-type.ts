export type RequiredProperties<T> = {
  [K in keyof T]-?: T[K] extends object ? RequiredProperties<T[K]> : T[K];
};