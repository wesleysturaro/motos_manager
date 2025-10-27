import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
