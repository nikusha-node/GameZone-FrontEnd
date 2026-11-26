import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../core/services/product';
import { ProductResponse } from '../../models/product/product-response';
import { ProductListResponse } from '../../models/product/product-list-response';

interface ComponentFilters {
  search: string;
  brandId: number | undefined;
  category: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: string;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-pc-components',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './pc-components.html',
  styleUrl: './pc-components.scss'
})
export class PcComponents implements OnInit {
  private productService = inject(ProductService);

  private allComponents: ProductResponse[] = [];

  components = signal<ProductResponse[]>([]);
  loading = signal(false);
  error = signal('');

  filters = signal<ComponentFilters>({
    search: '',
    brandId: undefined,
    category: undefined,
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

  categories = [
    { id: 0, name: 'Graphics Cards' },
    { id: 1, name: 'Processors' },
    { id: 2, name: 'Motherboards' },
    { id: 3, name: 'RAM' },
    { id: 4, name: 'Storage' },
    { id: 5, name: 'Power Supplies' },
    { id: 6, name: 'PC Cases' },
    { id: 7, name: 'Cooling' }
  ];

  ngOnInit(): void {
    this.loadComponents();
  }

  loadComponents(): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getAll().subscribe({
      next: (products) => {
        this.allComponents = products.filter(product =>
          product.category >= 0 && product.category <= 7
        );
        const brands = [
          ...new Map(
            this.allComponents
              .filter(product => product.brandName)
              .map(product => [
                product.brandId,
                {
                  id: product.brandId,
                  name: product.brandName!
                }
              ])
          ).values()
        ];

        this.brands.set(brands);
        this.applyLocalFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load PC components:', error);
        this.error.set('Failed to load PC components. Please try again.');
        this.loading.set(false);
      }
    });
  }

  filtersOpen = signal(false);

  toggleFilters(): void {
    this.filtersOpen.update(value => !value);
  }

  applyLocalFilters(): void {
    const filters = this.filters();

    let filtered = [...this.allComponents];
    if (filters.category !== undefined) {
      filtered = filtered.filter(
        product => product.category === filters.category
      );
    }
    if (filters.search.trim()) {
      const search = filters.search.trim().toLowerCase();

      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        (product.brandName?.toLowerCase().includes(search) ?? false) ||
        (product.description?.toLowerCase().includes(search) ?? false)
      );
    }
    if (filters.brandId !== undefined) {
      filtered = filtered.filter(
        product => product.brandId === filters.brandId
      );
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(
        product => product.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        product => product.price <= filters.maxPrice!
      );
    }
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime();

        case 'price-asc':
          return a.price - b.price;

        case 'price-desc':
          return b.price - a.price;

        default:
          return new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
      }
    });

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / filters.pageSize);
    const start = (filters.page - 1) * filters.pageSize;
    const paginatedProducts = filtered.slice(
      start,
      start + filters.pageSize
    );

    this.components.set(paginatedProducts);

    this.pagination.set({
      products: paginatedProducts,
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      totalPages
    });
  }

  updateFilter<K extends keyof ComponentFilters>(
    key: K,
    value: ComponentFilters[K]
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

    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      brandId: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'newest',
      page: 1,
      pageSize: 8
    });

    this.applyLocalFilters();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination().totalPages) {
      return;
    }

    this.updateFilter('page', page);
    this.applyLocalFilters();
  }
}
