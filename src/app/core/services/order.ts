import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CheckoutResponse,
  Order,
  OrderListResponse
} from '../../models/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Order`;

  checkout(): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/checkout`,
      {}
    );
  }

  getMyOrders(
    page: number = 1,
    pageSize: number = 10
  ): Observable<OrderListResponse> {
    const params = new HttpParams()
      .set('Page', page)
      .set('PageSize', pageSize);

    return this.http.get<OrderListResponse>(
      `${this.apiUrl}/my-orders`,
      { params }
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
