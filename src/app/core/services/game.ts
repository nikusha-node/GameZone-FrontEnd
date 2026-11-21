import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, GameFilters, GamePaginationResponse } from '../../models/game/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api/Game';

  getGames(filters: GameFilters = {}): Observable<GamePaginationResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<GamePaginationResponse>(this.apiUrl, { params });
  }
}
