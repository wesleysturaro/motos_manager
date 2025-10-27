import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { InventorySummaryResponse } from '../../models/estoque.model';
import { Motorcycle } from '../../models/moto.model';

@Component({
  selector: 'app-gestao-estoque',
  standalone: false,
  templateUrl: './gestao-estoque.component.html',
  styleUrls: ['./gestao-estoque.component.scss'],
})
export class GestaoEstoqueComponent implements OnInit {
  summary: InventorySummaryResponse | null = null;
  missing: Motorcycle[] = [];
  chartData: any;
  chartOptions: any;

  constructor(private readonly inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadMissing();
  }

  loadSummary(): void {
    this.inventoryService.getSummary().subscribe((data) => {
      this.summary = data;
      this.chartData = {
        labels: data.byBrand.map(
          (item) => item.brandname ?? item.brandName ?? item.brandid ?? item.brandId ?? 'Marca',
        ),
        datasets: [
          {
            label: 'Quantidade por Marca',
            data: data.byBrand.map((item) => Number(item.total)),
            backgroundColor: '#ff7a18',
          },
        ],
      };
      this.chartOptions = {
        plugins: {
          legend: { labels: { color: '#111' } },
        },
        scales: {
          y: { beginAtZero: true },
        },
      };
    });
  }

  loadMissing(): void {
    this.inventoryService.getMissing().subscribe((data) => (this.missing = data));
  }
}
