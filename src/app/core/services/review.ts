import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CreateReviewRequest,UpdateReviewRequest,Review} from '../../models/order/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Review`;

  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  create(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(
      `${this.apiUrl}/add-new-review`,
      request
    );
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.apiUrl}/my-reviews`
    );
  }

  update(id: number, request: UpdateReviewRequest): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/update-review${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
