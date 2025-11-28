import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Motorcycle } from '../../models/moto.model';
import { MotorcyclesService } from '../../services/motorcycles.service';
import { BrandsService } from '../../services/brands.service';
import { StoresService } from '../../services/stores.service';
import { Brand } from '../../models/marca.model';
import { Store } from '../../models/loja.model';
import { environment } from '../../../environments/environment';

interface GalleriaItem {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title?: string;
}

@Component({
  selector: 'app-visualizar-moto',
  standalone: false,
  templateUrl: './visualizar-moto.component.html',
  styleUrls: ['./visualizar-moto.component.scss'],
})
export class VisualizarMotoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  motorcycleId!: string;
  motorcycle: Motorcycle | null = null;
  vendaComLucro: any;

  stores: Store[] = [];
  brands: Brand[] = [];

  images: GalleriaItem[] = [];
  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  completenessScore = 0;
  missingFields: string[] = [];

  statusOptions = [
    { label: 'Disponivel', value: 'disponivel' },
    { label: 'Reservada', value: 'reservada' },
    { label: 'Vendida', value: 'vendida' },
    { label: 'Manutencao', value: 'manutencao' },
    { label: 'Informacao pendente', value: 'informacao_pendente' },
  ];

  fuelOptions = [
    { label: 'Gasolina', value: 'gasolina' },
    { label: 'Etanol', value: 'etanol' },
    { label: 'Flex', value: 'flex' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Eletrico', value: 'eletrico' },
    { label: 'Hibrido', value: 'hibrido' },
  ];

  transmissionOptions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatica', value: 'automatica' },
    { label: 'Semi-automatica', value: 'semi_automatica' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly motorcyclesService: MotorcyclesService,
    private readonly messageService: MessageService,
    private readonly brandsService: BrandsService,
    private readonly storesService: StoresService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Moto nao encontrada.',
        });
        this.router.navigate(['/']);
        return;
      }
      this.motorcycleId = id;
      this.loadMotorcycle();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.buildPayload();
    this.motorcyclesService.updateMotorcycle(this.motorcycleId, payload).subscribe({
      next: (updated) => {
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Moto atualizada!',
        });
        this.motorcycle = updated;
        this.vendaComLucro = this.calculateVendaComLucro(updated);
        this.completenessScore = updated.completenessScore ?? 0;
        this.missingFields = (updated as any).missingFields ?? [];
        this.prepareImages(updated);
        this.patchFormWithMotorcycle(updated);
      },
      error: () => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Nao foi possivel atualizar a moto.',
        });
      },
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      storeId: [''],
      brandId: [''],
      modelName: [''],
      year: [null, [Validators.min(1900)]],
      modelYear: [null, [Validators.min(1900)]],
      color: [''],
      vin: [''],
      plate: [''],
      km: [null, [Validators.min(0)]],
      price: [null, [Validators.min(0)]],
      cost: [null, [Validators.min(0)]],
      documentCost: [null, [Validators.min(0)]],
      maintenanceCost: [null, [Validators.min(0)]],
      downPayment: [null, [Validators.min(0)]],
      status: ['disponivel'],
      fuel: [''],
      engineCc: [null, [Validators.min(0)]],
      powerHp: [null, [Validators.min(0)]],
      torqueNm: [null, [Validators.min(0)]],
      transmission: [''],
      abs: [false],
      hasDocumentation: [false],
      hasInspection: [false],
      description: [''],
      clientName: [''],
      clientPhone: [''],
    });
  }

  private loadLookups(): void {
    this.storesService.list().subscribe((stores) => (this.stores = stores));
    this.brandsService.list().subscribe((brands) => (this.brands = brands));
  }

  private loadMotorcycle(): void {
    this.loading = true;
    this.motorcyclesService.getMotorcycle(this.motorcycleId).subscribe({
      next: (moto) => {
        this.motorcycle = moto;
        this.vendaComLucro = this.calculateVendaComLucro(moto);
        this.completenessScore = moto.completenessScore ?? 0;
        this.missingFields = (moto as any).missingFields ?? [];
        this.prepareImages(moto);
        this.patchFormWithMotorcycle(moto);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Nao foi possivel carregar os dados da moto.',
        });
        this.router.navigate(['/']);
      },
    });
  }

  private patchFormWithMotorcycle(moto: Motorcycle): void {
    const toNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === '') return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    this.form.patchValue({
      storeId: moto.store?.id ?? '',
      brandId: moto.brand?.id ?? '',
      modelName: moto.modelName ?? '',
      year: moto.year ?? null,
      modelYear: moto.modelYear ?? null,
      color: moto.color ?? '',
      vin: moto.vin ?? '',
      plate: moto.plate ?? '',
      km: toNumber(moto.km),
      price: toNumber(moto.price),
      cost: toNumber(moto.cost),
      documentCost: toNumber(moto.documentCost),
      maintenanceCost: toNumber(moto.maintenanceCost),
      downPayment: toNumber(moto.downPayment),
      status: moto.status ?? 'disponivel',
      fuel: moto.fuel ?? '',
      engineCc: toNumber(moto.engineCc),
      powerHp: toNumber(moto.powerHp),
      torqueNm: toNumber(moto.torqueNm),
      transmission: moto.transmission ?? '',
      abs: Boolean(moto.abs),
      hasDocumentation: Boolean(moto.hasDocumentation),
      hasInspection: Boolean(moto.hasInspection),
      description: moto.description ?? '',
      clientName: moto.clientName ?? '',
      clientPhone: moto.clientPhone ?? '',
    });
  }

  private prepareImages(moto: Motorcycle): void {
    this.images =
      moto.photos?.map((photo, index) => {
        const url = this.buildPhotoUrl(photo.pathOrUrl);
        return {
          itemImageSrc: url,
          thumbnailImageSrc: url,
          alt: `Foto ${index + 1}`,
          title: photo.isCover ? 'Capa' : undefined,
        };
      }) ?? [];
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

  private buildPayload(): Record<string, unknown> {
    const formValue = this.form.value;
    const toNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const toStringOrNull = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      const str = String(value).trim();
      return str.length ? str : null;
    };

    return {
      storeId: formValue.storeId,
      brandId: formValue.brandId,
      modelName: toStringOrNull(formValue.modelName),
      year: toNumber(formValue.year),
      modelYear: toNumber(formValue.modelYear),
      color: toStringOrNull(formValue.color),
      vin: toStringOrNull(formValue.vin),
      plate: toStringOrNull(formValue.plate),
      km: toNumber(formValue.km),
      price: toNumber(formValue.price),
      cost: toNumber(formValue.cost),
      documentCost: toNumber(formValue.documentCost),
      maintenanceCost: toNumber(formValue.maintenanceCost),
      downPayment: toNumber(formValue.downPayment),
      status: formValue.status,
      fuel: toStringOrNull(formValue.fuel),
      engineCc: toNumber(formValue.engineCc),
      powerHp: toNumber(formValue.powerHp),
      torqueNm: toNumber(formValue.torqueNm),
      transmission: toStringOrNull(formValue.transmission),
      abs: !!formValue.abs,
      hasDocumentation: !!formValue.hasDocumentation,
      hasInspection: !!formValue.hasInspection,
      description: toStringOrNull(formValue.description),
      clientName: toStringOrNull(formValue.clientName),
      clientPhone: toStringOrNull(formValue.clientPhone),
    };
  }

  private buildPhotoUrl(pathOrUrl: string): string {
    const trimmed = pathOrUrl?.trim();
    if (!trimmed) {
      return '';
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const apiBase = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${apiBase}/${trimmed.replace(/^\/+/, '')}`;
  }

  private calculateVendaComLucro(moto: Motorcycle): number {
    const toNumber = (value: unknown): number => {
      const parsed = Number(value ?? 0);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const precoBase = toNumber(moto.price);
    const doc = toNumber(moto.documentCost);
    const manut = toNumber(moto.maintenanceCost);
    const margem = 2000;

    return precoBase + doc + manut + margem;
  }
}
