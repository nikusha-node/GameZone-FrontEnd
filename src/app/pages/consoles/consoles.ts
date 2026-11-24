import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../core/services/product';
import { Console } from '../../models/console/console.model';
import { ConsoleFilters } from '../../models/console/console-filters.model';
import { ProductListResponse } from '../../models/product/product-list-response';

@Component({
  selector: 'app-consoles',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './consoles.html',
  styleUrl: './consoles.scss'
})
export class Consoles implements OnInit {
  private productService = inject(ProductService);

  consoles = signal<Console[]>([]);
  loading = signal(false);
  error = signal('');

  filters = signal<ConsoleFilters>({
    search: '',
    brandId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'newest',
    page: 1,
    pageSize: 8
  });

  pagination = signal<ProductListResponse>({
    products: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 0
  });

  brands = signal<{ id: number; name: string }[]>([]);

  ngOnInit(): void {
    this.loadConsoles();
  }

  loadConsoles(): void {
    this.loading.set(true);
    this.error.set('');

    const filters = this.filters();

    const params: Record<string, string | number | boolean> = {
      category: 9,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 8,
      sortBy: filters.sortBy ?? 'newest'
    };

    if (filters.search) {
      params['search'] = filters.search;
    }

    if (filters.brandId !== undefined) {
      params['brandId'] = filters.brandId;
    }

    if (filters.minPrice !== undefined) {
      params['minPrice'] = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      params['maxPrice'] = filters.maxPrice;
    }

    this.productService.getFiltered(params).subscribe({
      next: (response) => {
        this.pagination.set(response);
        this.consoles.set(response.products);

        const brands = [
          ...new Map(
            response.products
              .filter(product => product.brandName)
              .map(product => [
                product.brandId,
                { id: product.brandId, name: product.brandName! }
              ])
          ).values()
        ];

        this.brands.set(brands);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load consoles:', error);
        this.error.set('Failed to load consoles. Please try again.');
        this.loading.set(false);
      }
    });
  }

  updateFilter<K extends keyof ConsoleFilters>(
    key: K,
    value: ConsoleFilters[K]
  ): void {
    this.filters.update(current => ({
      ...current,
      [key]: value
    }));
  }

  applyFilters(): void {
    this.filters.update(current => ({
      ...current,
      page: 1
    }));

    this.loadConsoles();
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest',
      page: 1,
      pageSize: 8
    });

    this.loadConsoles();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination().totalPages) {
      return;
    }

    this.updateFilter('page', page);
    this.loadConsoles();
  }
}
