export interface PaginationResponseType {
  total: number
  skip: number
  limit: number
}

export interface Paginated<T> extends PaginationResponseType {
  data: T
}