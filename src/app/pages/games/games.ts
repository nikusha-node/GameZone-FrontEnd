import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../../core/services/game';
import { Game, GameFilters, GamePaginationResponse } from '../../models/game/game.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-games',
  imports: [FormsModule, DatePipe],
  templateUrl: './games.html',
  styleUrl: './games.scss'
})
export class Games implements OnInit {
  private gameService = inject(GameService);

  private cdr = inject(ChangeDetectorRef);

  showPriceFilter = true;
  showPlatformFilter = true;
  showGenreFilter = true;
  showAgeFilter = true;

  genreSearch = '';
  showAllGenres = false;

  saleOnly = false;

  games: Game[] = [];
  loading = false;
  error = '';

  filters: GameFilters = {
    search: '',
    platform: '',
    genre: '',
    minPrice: undefined,
    maxPrice: undefined,
    onSale: undefined,
    ageRating: '',
    sortBy: 'newest',
    page: 1,
    pageSize: 8
  };

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

  applyFilters(): void {
    this.filters.page = 1;
    this.loadGames();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      platform: '',
      genre: '',
      minPrice: undefined,
      maxPrice: undefined,
      onSale: undefined,
      ageRating: '',
      sortBy: 'newest',
      page: 1,
      pageSize: 8
    };

    this.saleOnly = false;
    this.genreSearch = '';
    this.showAllGenres = false;
    this.loadGames();
  }

  selectAgeRating(rating: string, checked: boolean): void {
    this.filters.ageRating = checked ? rating : '';
    this.applyFilters();

  }
  get filteredGenres(): string[] {
    const filtered = this.genres.filter(genre =>
      genre.toLowerCase().includes(this.genreSearch.toLowerCase())
    );

    return this.showAllGenres || this.genreSearch
      ? filtered
      : filtered.slice(0, 8);
  }


  toggleFilter(section: string): void {
    switch (section) {
      case 'price':
        this.showPriceFilter = !this.showPriceFilter;
        break;

      case 'platform':
        this.showPlatformFilter = !this.showPlatformFilter;
        break;

      case 'genre':
        this.showGenreFilter = !this.showGenreFilter;
        break;

      case 'age':
        this.showAgeFilter = !this.showAgeFilter;
        break;
    }
  }

  selectPlatform(platform: string, checked: boolean): void {
    this.filters.platform = checked ? platform : '';
    this.applyFilters();
  }

  selectGenre(genre: string, checked: boolean): void {
    this.filters.genre = checked ? genre : '';
    this.applyFilters();
  }

  pagination: GamePaginationResponse = {
    items: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 0
  };

  ngOnInit(): void {
    this.loadGames();

  }

  loadGames(): void {
    this.loading = true;
    this.error = '';


    const requestStart = performance.now();

    this.gameService.getGames(this.filters).subscribe({
      next: (response) => {
        console.log('Games API time:', (performance.now() - requestStart).toFixed(2), 'ms');
        const start = performance.now();

        this.pagination = response;
        this.games = response.items;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load games:', error);
        this.error = 'Failed to load games. Please try again.';
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination.totalPages) return;

    this.filters.page = page;
    this.loadGames();
  }
}
