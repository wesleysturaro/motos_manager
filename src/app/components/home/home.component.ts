import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/marca.model';
import { MotorcycleFilters } from '../../models/moto.model';

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
    this.filterForm.reset({ brandId: '', modelName: '' });
    this.activeFilters = {};
  }

  goToCadastro(): void {
    this.router.navigate(['/cadastro']);
  }
}
