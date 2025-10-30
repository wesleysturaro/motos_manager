import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Motorcycle, MotorcycleFilters } from '../../models/moto.model';
import { MotorcyclesService } from '../../services/motorcycles.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tabela-principal-estoque',
  templateUrl: './tabela-principal-estoque.component.html',
  standalone: false,
  styleUrls: ['./tabela-principal-estoque.component.scss'],
})
export class TabelaPrincipalEstoqueComponent implements OnInit, OnChanges {
  @Input() filters: MotorcycleFilters | null = {};
  @Output() edit = new EventEmitter<Motorcycle>();
  @Output() view = new EventEmitter<Motorcycle>();
  @Output() remove = new EventEmitter<Motorcycle>();

  motorcycles: Motorcycle[] = [];
  loading = false;

  constructor(
    private readonly motorcyclesService: MotorcyclesService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    this.motorcyclesService.getMotorcycles(this.filters ?? {}).subscribe({
      next: (data) => {
        this.motorcycles = data.map((moto) => ({
          ...moto,
          price: moto.price !== null && moto.price !== undefined ? Number(moto.price) : null,
          cost: moto.cost !== null && moto.cost !== undefined ? Number(moto.cost) : null,
          documentCost:
            moto.documentCost !== null && moto.documentCost !== undefined
              ? Number(moto.documentCost)
              : null,
          maintenanceCost:
            moto.maintenanceCost !== null && moto.maintenanceCost !== undefined
              ? Number(moto.maintenanceCost)
              : null,
          downPayment:
            moto.downPayment !== null && moto.downPayment !== undefined
              ? Number(moto.downPayment)
              : null,
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  triggerEdit(moto: Motorcycle): void {
    this.edit.emit(moto);
  }

  triggerView(moto: Motorcycle): void {
    this.view.emit(moto);
  }

  triggerDelete(moto: Motorcycle): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a moto ${moto.modelName}?`,
      header: 'Confirmar exclus\u00e3o',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'N\u00e3o',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.deleteMotorcycle(moto),
    });
  }

  getStatusSeverity(status?: string): string {
    switch (status) {
      case 'disponivel':
        return 'success';
      case 'reservada':
        return 'info';
      case 'vendida':
        return 'danger';
      case 'manutencao':
        return 'warn';
      case 'informacao_pendente':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getPrimaryPhotoUrl(moto: Motorcycle): string | null {
    if (!moto?.photos || moto.photos.length === 0) {
      return null;
    }

    const coverPhoto = moto.photos.find((photo) => photo.isCover);
    const selectedPhoto = coverPhoto ?? moto.photos[0];
    const path = selectedPhoto?.pathOrUrl?.trim();
    if (!path) {
      return null;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const apiBase = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${apiBase}/${path.replace(/^\/+/, '')}`;
  }

  private deleteMotorcycle(moto: Motorcycle): void {
    this.loading = true;
    this.motorcyclesService.deleteMotorcycle(moto.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exclu\u00edda',
          detail: 'Moto removida com sucesso.',
        });
        this.remove.emit(moto);
        this.loadData();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'N\u00e3o foi poss\u00edvel excluir a moto.',
        });
      },
    });
  }
}
