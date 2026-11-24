import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../core/services/game';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Game } from '../../models/game/game.model';
import { ProductResponse } from '../../models/product/product-response';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [RouterLink, DatePipe, DecimalPipe],
    templateUrl: './product-details.html',
    styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
    private route = inject(ActivatedRoute);
    private gameService = inject(GameService);
    private productService = inject(ProductService);

    protected cartService = inject(CartService);
    private authService = inject(AuthService);

    product = signal<ProductResponse | null>(null);
    game = signal<Game | null>(null);

    loading = signal(false);
    error = signal('');

    quantity = signal(1);
    addingToCart = signal(false);
    cartMessage = signal('');

    activeTab = signal<'description' | 'details'>('description');

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        const productType = this.route.snapshot.data['productType'];

        if (!id || id <= 0) {
            this.error.set('Invalid product ID.');
            return;
        }

        this.loadProduct(id, productType);
    }

    private loadProduct(id: number, productType: string): void {
        this.loading.set(true);
        this.error.set('');

        if (productType === 'game') {
            this.gameService.getById(id).subscribe({
                next: game => {
                    this.game.set(game);
                    this.loadProductData(game.productId);
                },
                error: error => {
                    console.error('Failed to load game:', error);
                    this.error.set('Game not found.');
                    this.loading.set(false);
                }
            });

            return;
        }

        this.loadProductData(id);
    }

    private loadProductData(id: number): void {
        this.productService.getById(id).subscribe({
            next: product => {
                this.product.set(product);
                this.loading.set(false);
            },
            error: error => {
                console.error('Failed to load product:', error);
                this.error.set('Product not found.');
                this.loading.set(false);
            }
        });
    }

    increaseQuantity(): void {
        const current = this.quantity();
        const stock = this.product()?.stockQuantity ?? 0;

        if (current < stock) {
            this.quantity.set(current + 1);
        }
    }

    decreaseQuantity(): void {
        if (this.quantity() > 1) {
            this.quantity.update(value => value - 1);
        }
    }

    addToCart(): void {
        const product = this.product();

        if (!product || product.stockQuantity <= 0) {
            return;
        }

        if (!this.authService.isAuthenticated()) {
            this.cartMessage.set('Please log in to add products to your cart.');
            return;
        }

        this.addingToCart.set(true);
        this.cartMessage.set('');

        this.cartService.addToCart({
            productId: product.id,
            quantity: this.quantity()
        }).subscribe({
            next: () => {
                this.cartMessage.set('Product added to cart successfully.');
                this.addingToCart.set(false);
            },
            error: error => {
                console.error('Failed to add product to cart:', error);
                this.cartMessage.set(
                    error.error?.message || 'Could not add product to cart.'
                );
                this.addingToCart.set(false);
            }
        });
    }
}
