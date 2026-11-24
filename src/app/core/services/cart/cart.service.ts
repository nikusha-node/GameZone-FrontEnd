
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
    Cart,
    AddToCartRequest,
    UpdateCartItemRequest
} from '../../../models/cart/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/Cart`;

    cart = signal<Cart | null>(null);

    getCart(): Observable<Cart> {
        return this.http.get<Cart>(
            `${this.apiUrl}/get-cart-product`
        ).pipe(
            tap(response => this.cart.set(response))
        );
    }

    addToCart(request: AddToCartRequest): Observable<Cart> {
        return this.http.post<Cart>(
            `${this.apiUrl}/add-to-cart`,
            request
        ).pipe(
            tap(response => this.cart.set(response))
        );
    }

    updateCartItem(
        id: number,
        request: UpdateCartItemRequest
    ): Observable<Cart> {
        return this.http.put<Cart>(
            `${this.apiUrl}/update-product/${id}`,
            request
        ).pipe(
            tap(response => this.cart.set(response))
        );
    }

    removeCartItem(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/delete-product/${id}`
        ).pipe(
            tap(() => {
                this.cart.update(current => {
                    if (!current) return null;

                    const items = current.items.filter(item => item.id !== id);

                    return {
                        ...current,
                        items,
                        totalPrice: items.reduce(
                            (total, item) => total + item.subtotal,
                            0
                        )
                    };
                });
            })
        );
    }

    clearCart(): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/clear-cart`
        ).pipe(
            tap(() => {
                this.cart.update(current =>
                    current ? { ...current, items: [], totalPrice: 0 } : null
                );
            })
        );
    }

    getItemCount(): number {
        return this.cart()?.items.reduce(
            (total, item) => total + item.quantity,
            0
        ) ?? 0;
    }
}
