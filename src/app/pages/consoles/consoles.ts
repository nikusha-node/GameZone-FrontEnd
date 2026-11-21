import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product';
import { Console } from '../../models/console/console.model';
import { ConsoleFilters } from '../../models/console/console-filters.model';
import { ProductListResponse } from '../../models/product/product-list-response';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-consoles',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './consoles.html',
  styleUrl: './consoles.scss'
})
export class Consoles implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  consoles: Console[] = [];
  loading = false;
  error = '';

  filters: ConsoleFilters = {
    search: '',
    brandId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'newest',
    page: 1,
    pageSize: 8
  };

  pagination: ProductListResponse = {
    products: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 0
  };

  brands: { id: number; name: string }[] = [];

  ngOnInit(): void {
    this.loadConsoles();
  }

  loadConsoles(): void {
    this.loading = true;
    this.error = '';

    const params: Record<string, string | number | boolean> = {
      category: 9,
      page: this.filters.page ?? 1,
      pageSize: this.filters.pageSize ?? 8,
      sortBy: this.filters.sortBy ?? 'newest'
    };

    if (this.filters.search) {
      params['search'] = this.filters.search;
    }

    if (this.filters.brandId !== undefined) {
      params['brandId'] = this.filters.brandId;
    }

    if (this.filters.minPrice !== undefined) {
      params['minPrice'] = this.filters.minPrice;
    }

    if (this.filters.maxPrice !== undefined) {
      params['maxPrice'] = this.filters.maxPrice;
    }

    this.productService.getFiltered(params).subscribe({
      next: (response) => {
        this.pagination = response;
        this.consoles = response.products;

        this.brands = [
          ...new Map(
            response.products
              .filter(product => product.brandName)
              .map(product => [
                product.brandId,
                { id: product.brandId, name: product.brandName! }
              ])
          ).values()
        ];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load consoles:', error);
        this.error = 'Failed to load consoles. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadConsoles();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest',
      page: 1,
      pageSize: 8
    };

    this.loadConsoles();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination.totalPages) {
      return;
    }

    this.filters.page = page;
    this.loadConsoles();
  }
}
