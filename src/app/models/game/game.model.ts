export interface Game {
  id: number;
  name: string;
  description: string | null;
  releaseDate: string;
  developer: string;
  publisher: string;
  platforms: string[];
  genres: string[];
  ageRating: string;
  productId: number;
  createdAt: string;
}

export interface GamePaginationResponse {
  items: Game[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GameFilters {
  search?: string;
  platform?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  ageRating?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
