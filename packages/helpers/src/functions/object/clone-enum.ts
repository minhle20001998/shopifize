export function cloneEnum<T>(originalEnum: T): { [key in keyof T]: T[key] } {
  const clone: any = {};
  for (const key in originalEnum) {
      clone[key] = originalEnum[key];
  }
  return clone;
}