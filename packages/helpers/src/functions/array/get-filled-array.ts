export function getFilledArray<
  T extends (v: number, k: number) => unknown,
  Y extends ReturnType<T>,
>(range: number, mapfn: T): Y[] {
  return range <= 0 ? [] : (Array.from({ length: range }, mapfn) as Y[]);
}
