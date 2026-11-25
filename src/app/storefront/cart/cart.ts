import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { CheckoutResponse } from '../../models/order/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  protected cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private orderService = inject(OrderService);

  loading = signal(false);
  error = signal('');
  checkingOut = signal(false);
  checkoutError = signal('');

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.error.set('Please log in to view your cart.');
      return;
    }

    this.loading.set(true);

    this.cartService.getCart().subscribe({
      next: () => this.loading.set(false),
      error: error => {
        console.error('Failed to load cart:', error);
        this.error.set('Could not load your cart.');
        this.loading.set(false);
      }
    });
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity < 1) return;

    this.cartService.updateCartItem(id, { quantity }).subscribe({
      error: error => console.error('Failed to update quantity:', error)
    });
  }

  removeItem(id: number): void {
    this.cartService.removeCartItem(id).subscribe({
      error: error => console.error('Failed to remove item:', error)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      error: error => console.error('Failed to clear cart:', error)
    });
  }
  checkout(): void {
    if (this.checkingOut()) return;

    this.checkingOut.set(true);
    this.checkoutError.set('');

    this.orderService.checkout().subscribe({
      next: (response: CheckoutResponse) => {
        this.checkingOut.set(false);

        this.cartService.cart.update(current =>
          current ? { ...current, items: [], totalPrice: 0 } : null
        );

        this.router.navigate(['/order-success'], {
          state: { order: response }
        });
      },
      error: error => {
        console.error('Checkout failed:', error);

        this.checkoutError.set(
          error.error?.message ||
          error.error?.title ||
          'Checkout failed. Please try again.'
        );

        this.checkingOut.set(false);
        
        this.cartService.getCart().subscribe({
          error: err => console.error('Failed to refresh cart:', err)
        });
      }
    });
  }
}
