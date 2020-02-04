export interface PagingRequest {
  start: number;
  limit: number;
  search?: string;
}

export interface PagingResponse<T> {
  result: T[];
  total: number;
}
