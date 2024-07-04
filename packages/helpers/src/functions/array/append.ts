export function append<T extends unknown[]>(array: T, item: T[keyof T]): T {
  return [...array, item] as T;
}
