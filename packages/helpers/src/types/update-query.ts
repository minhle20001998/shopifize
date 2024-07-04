export interface UpdateQueryType<T> {
  where: Partial<T>;
  update: Partial<T>;
}
