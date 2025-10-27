import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Motorcycle, MotorcycleFilters } from '../../models/moto.model';
import { MotorcyclesService } from '../../services/motorcycles.service';

@Component({
  selector: 'app-tabela-principal-estoque',
  templateUrl: './tabela-principal-estoque.component.html',
  standalone: false,
  styleUrls: ['./tabela-principal-estoque.component.scss'],
})
export class TabelaPrincipalEstoqueComponent implements OnInit, OnChanges {
  @Input() filters: MotorcycleFilters | null = {};
  @Output() edit = new EventEmitter<Motorcycle>();
  @Output() remove = new EventEmitter<Motorcycle>();

  motorcycles: Motorcycle[] = [];
  loading = false;

  constructor(private readonly motorcyclesService: MotorcyclesService) {}

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

  triggerDelete(moto: Motorcycle): void {
    this.remove.emit(moto);
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
}
