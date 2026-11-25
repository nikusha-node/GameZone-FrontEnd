export interface CheckoutResponse {
  orderId: number;
  totalAmount: number;
  orderStatus: string | number;
  orderDate: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string | number;
  items: OrderItem[];
}

export interface OrderListResponse {
  orders: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
