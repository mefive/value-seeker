export interface PagingRequest {
  start: number;
  limit: number;
}

export interface PagingResponse<T> {
  result: T[];
  total: number;
}
