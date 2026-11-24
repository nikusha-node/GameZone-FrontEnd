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

  getGames(filters: GameFilters): Observable<GamePaginationResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        const paramName = key === 'platform'
          ? 'platforms'
          : key === 'genre'
            ? 'genres'
            : key;

        value.forEach(item => {
          params = params.append(paramName, item);
        });
      } else {
        params = params.set(key, value);
      }
    });


    return this.http.get<GamePaginationResponse>(`${this.apiUrl}/getall`, { params });
  }

  getById(id: number): Observable<Game> {
    return this.http.get<Game>(
      `${this.apiUrl}/get-by${id}`
    );
  }
}
