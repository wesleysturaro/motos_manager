import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/usuario.model';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  sidebarVisible = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
