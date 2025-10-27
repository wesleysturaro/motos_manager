import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/usuario.model';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'rleo_access_token';
  private readonly refreshTokenKey = 'rleo_refresh_token';
  private readonly userKey = 'rleo_user';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.persistSession(response)));
  }

  logout(): void {
    sessionStorage.removeItem(this.accessTokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  getCurrentUser(): User | null {
    const userRaw = sessionStorage.getItem(this.userKey);
    return userRaw ? (JSON.parse(userRaw) as User) : null;
  }

  private persistSession(response: AuthResponse): void {
    sessionStorage.setItem(this.accessTokenKey, response.tokens.accessToken);
    sessionStorage.setItem(this.refreshTokenKey, response.tokens.refreshToken);
    sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
  }
}
