import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-lateral',
  standalone: false,
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent {
  @Input() visible = true;
  @Output() navigate = new EventEmitter<void>();

  items: MenuItem[] = [];

  constructor(private readonly router: Router) {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.goTo('/'),
      },
      {
        label: 'Cadastro de Motos',
        icon: 'pi pi-plus-circle',
        command: () => this.goTo('/cadastro'),
      },
      {
        label: 'Gestao de Estoque',
        icon: 'pi pi-chart-bar',
        command: () => this.goTo('/estoque'),
      },
    ];
  }

  private goTo(path: string): void {
    this.router.navigate([path]).then(() => this.navigate.emit());
  }
}
