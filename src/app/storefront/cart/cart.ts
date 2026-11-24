import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth';
import { DecimalPipe } from '@angular/common';

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

  loading = signal(false);
  error = signal('');

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
}
