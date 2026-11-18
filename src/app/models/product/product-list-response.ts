import { ProductResponse } from './product-response';

export interface ProductListResponse {
  products: ProductResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}