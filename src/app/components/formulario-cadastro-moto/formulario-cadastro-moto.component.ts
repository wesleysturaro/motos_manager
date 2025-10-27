import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoresService } from '../../services/stores.service';
import { BrandsService } from '../../services/brands.service';
import { MotorcyclesService } from '../../services/motorcycles.service';
import { Store } from '../../models/loja.model';
import { Brand } from '../../models/marca.model';

@Component({
  selector: 'app-formulario-cadastro-moto',
  standalone: false,
  templateUrl: './formulario-cadastro-moto.component.html',
  styleUrls: ['./formulario-cadastro-moto.component.scss'],
})
export class FormularioCadastroMotoComponent implements OnInit {
  form!: FormGroup;
  stores: Store[] = [];
  brands: Brand[] = [];
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly storesService: StoresService,
    private readonly brandsService: BrandsService,
    private readonly motorcyclesService: MotorcyclesService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      storeId: ['', Validators.required],
      brandId: ['', Validators.required],
      modelName: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1970)]],
      km: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.min(0)]],
      cost: [null, [Validators.min(0)]],
      documentCost: [null, [Validators.min(0)]],
      maintenanceCost: [null, [Validators.min(0)]],
      downPayment: [null, [Validators.min(0)]],
      status: ['disponivel'],
      color: [''],
      description: [''],
      clientName: [''],
      clientPhone: [''],
    });

    this.loadLookups();
  }

  loadLookups(): void {
    this.storesService.list().subscribe((data) => (this.stores = data));
    this.brandsService.list().subscribe((data) => (this.brands = data));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      ...this.form.value,
      price: this.form.value.price ?? undefined,
      cost: this.form.value.cost ?? undefined,
      documentCost: this.form.value.documentCost ?? undefined,
      maintenanceCost: this.form.value.maintenanceCost ?? undefined,
      downPayment: this.form.value.downPayment ?? undefined,
      km: this.form.value.km ?? 0,
    };

    this.motorcyclesService.createMotorcycle(payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Moto cadastrada!' });
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nao foi possivel salvar.' });
      },
    });
  }
}
