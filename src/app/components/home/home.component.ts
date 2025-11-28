import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/marca.model';
import { Motorcycle, MotorcycleFilters } from '../../models/moto.model';
import { TabelaPrincipalEstoqueComponent } from '../tabela-principal-estoque/tabela-principal-estoque.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  filterForm!: FormGroup;
  brands: Brand[] = [];
  activeFilters: MotorcycleFilters = {};
  displayEditDialog = false;
  selectedMotorcycle: Motorcycle | null = null;
  @ViewChild('estoqueTabela') estoqueTabela?: TabelaPrincipalEstoqueComponent;

  constructor(
    private readonly fb: FormBuilder,
    private readonly brandsService: BrandsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      brandId: [''],
      modelName: [''],
      minPrice: [null],
      maxPrice: [null],
      minKm: [null],
      maxKm: [null],
      year: [null],
      modelYear: [null],
    });

    this.loadBrands();
    this.activeFilters = { ...this.filterForm.value };
    this.filterForm.valueChanges.subscribe(() => {
      this.activeFilters = { ...this.filterForm.value };
    });
  }

  loadBrands(): void {
    this.brandsService.list().subscribe((data) => (this.brands = data));
  }

  clearFilters(): void {
    this.filterForm.reset({ brandId: '', modelName: '', year: null, modelYear: null });
    this.activeFilters = {};
  }

  goToCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  onEdit(moto: Motorcycle): void {
    this.selectedMotorcycle = moto;
    this.displayEditDialog = true;
  }

  onView(moto: Motorcycle): void {
    this.router.navigate(['/motos', moto.id]);
  }

  onDialogHide(): void {
    this.displayEditDialog = false;
    this.selectedMotorcycle = null;
  }

  onMotorcycleSaved(_motorcycle: Motorcycle): void {
    this.onDialogHide();
    this.estoqueTabela?.loadData();
  }
}
