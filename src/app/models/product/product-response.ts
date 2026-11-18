export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  brandId: number;
  brandName: string | null;
  category: number;
  createdAt: string;
}