export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}
