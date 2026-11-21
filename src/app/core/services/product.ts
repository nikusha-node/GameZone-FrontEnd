import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductListResponse } from '../../models/product/product-list-response';
import { ProductResponse } from '../../models/product/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Product`;

  getAll(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.apiUrl);
  }

  getLatest(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(
      `${this.apiUrl}/filter`,
      {
        params: {
          page: 1,
          pageSize: 8,
          sortBy: 'newest'
        }
      }
    );
  }

  getFiltered(params: {
    [param: string]: string | number | boolean;
  }): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(
      `${this.apiUrl}/filter`,
      { params }
    );
  }
}