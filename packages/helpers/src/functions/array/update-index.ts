export function updateIndex<T extends unknown[]>(
  array: T,
  indexItem: number,
  item: T[keyof T]
): T {
  return array.map((chipItem, index) => {
    return indexItem === index ? item : chipItem
  }) as T
}