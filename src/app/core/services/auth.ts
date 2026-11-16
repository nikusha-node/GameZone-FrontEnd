import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LoginRequest } from '../../models/auth/login-request';
import { RegisterRequest } from '../../models/auth/register-request';
import { VerifyEmailRequest } from '../../models/auth/verify-email-request';
import { UserToken } from '../../models/auth/user-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly tokenKey = 'gamezone_token';

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      request,
      { responseType: 'text' }
    );
  }

  login(request: LoginRequest): Observable<UserToken> {
    return this.http.post<UserToken>(
      `${this.apiUrl}/login`,
      request
    ).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  verifyEmail(request: VerifyEmailRequest): Observable<UserToken> {
    return this.http.post<UserToken>(
      `${this.apiUrl}/verify`,
      request
    ).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  private saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
