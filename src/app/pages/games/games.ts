import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { GameService } from '../../core/services/game';
import { Game, GameFilters, GamePaginationResponse } from '../../models/game/game.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './games.html',
  styleUrl: './games.scss'
})
export class Games implements OnInit {
  private gameService = inject(GameService);

  filtersOpen = signal(false);
  showPriceFilter = signal(true);
  showPlatformFilter = signal(true);
  showGenreFilter = signal(true);
  showAgeFilter = signal(true);
  genreSearch = signal('');
  showAllGenres = signal(false);
  games = signal<Game[]>([]);
  loading = signal(false);
  error = signal('');

  filters = signal<GameFilters>({
    search: '',
    platform: [],
    genre: [],
    minPrice: undefined,
    maxPrice: undefined,
    onSale: undefined,
    ageRating: '',
    sortBy: 'newest',
    page: 1,
    pageSize: 8
  });

  platforms = [
    'PlayStation 4',
    'PlayStation 5',
    'Xbox One',
    'Xbox Series X/S',
    'Nintendo Switch'
  ];

  genres = [
    'Action',
    'Adventure',
    'Racing',
    'Horror',
    'RPG',
    'Shooter',
    'Sports',
    'Simulation',
    'Strategy',
    'Fighting',
    'Puzzle',
    'Open World'
  ];

  ageRatings = [
    'PEGI3',
    'PEGI7',
    'PEGI12',
    'PEGI16',
    'PEGI18'
  ];

  pagination = signal<GamePaginationResponse>({
    items: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 0
  });

  filteredGenres = computed(() => {
    const search = this.genreSearch().toLowerCase();

    const filtered = this.genres.filter(genre =>
      genre.toLowerCase().includes(search)
    );

    return this.showAllGenres() || search
      ? filtered
      : filtered.slice(0, 8);
  });

  ngOnInit(): void {
    this.loadGames();
  }

  toggleFilters(): void {
    this.filtersOpen.update(value => !value);
  }

  updateFilter<K extends keyof GameFilters>(
    key: K,
    value: GameFilters[K]
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

    this.loadGames();
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      platform: [],
      genre: [],
      minPrice: undefined,
      maxPrice: undefined,
      onSale: undefined,
      ageRating: '',
      sortBy: 'newest',
      page: 1,
      pageSize: 8
    });

    this.genreSearch.set('');
    this.showAllGenres.set(false);
    this.filtersOpen.set(false);

    this.loadGames();
  }

  selectAgeRating(rating: string, checked: boolean): void {
    this.updateFilter('ageRating', checked ? rating : '');
    this.applyFilters();
  }

  toggleFilter(section: string): void {
    switch (section) {
      case 'price':
        this.showPriceFilter.update(value => !value);
        break;

      case 'platform':
        this.showPlatformFilter.update(value => !value);
        break;

      case 'genre':
        this.showGenreFilter.update(value => !value);
        break;

      case 'age':
        this.showAgeFilter.update(value => !value);
        break;
    }
  }

  selectPlatform(platform: string, checked: boolean): void {
    this.filters.update(current => {
      const selected = current.platform ?? [];

      return {
        ...current,
        platform: checked
          ? [...selected, platform]
          : selected.filter(item => item !== platform)
      };
    });

    this.applyFilters();
  }

  selectGenre(genre: string, checked: boolean): void {
    this.filters.update(current => {
      const selected = current.genre ?? [];

      return {
        ...current,
        genre: checked
          ? [...selected, genre]
          : selected.filter(item => item !== genre)
      };
    });

    this.applyFilters();
  }

  loadGames(): void {
    this.loading.set(true);
    this.error.set('');

    this.gameService.getGames(this.filters()).subscribe({
      next: response => {
        this.pagination.set(response);
        this.games.set(response.items);
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load games:', error);
        this.error.set('Failed to load games. Please try again.');
        this.loading.set(false);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination().totalPages) {
      return;
    }

    this.updateFilter('page', page);
    this.loadGames();
  }
}
