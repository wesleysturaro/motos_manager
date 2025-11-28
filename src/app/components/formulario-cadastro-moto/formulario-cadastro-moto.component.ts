import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoresService } from '../../services/stores.service';
import { BrandsService } from '../../services/brands.service';
import { MotorcyclesService } from '../../services/motorcycles.service';
import { Store } from '../../models/loja.model';
import { Brand } from '../../models/marca.model';
import { Motorcycle } from '../../models/moto.model';
import { FileUpload, FileSelectEvent, FileRemoveEvent, FileUploadHandlerEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-formulario-cadastro-moto',
  standalone: false,
  templateUrl: './formulario-cadastro-moto.component.html',
  styleUrls: ['./formulario-cadastro-moto.component.scss'],
})
export class FormularioCadastroMotoComponent implements OnInit, OnChanges {
  @Input() initialMotorcycle: Motorcycle | null = null;
  @Input() showActions = true;
  @Input() editDialog = false;
  @ViewChild('photoUploader') photoUploader?: FileUpload;
  @Output() saved = new EventEmitter<Motorcycle>();

  form!: FormGroup;
  stores: Store[] = [];
  brands: Brand[] = [];
  loading = false;
  photoUploads: Array<{ file: File; key: string; previewUrl: string | null }> = [];

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
      year: [null, [Validators.min(1970)]],
      modelYear: [null, [Validators.min(1970)]],
      km: [null, [Validators.min(0)]],
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
      vin: [''],
      plate: [''],
    });

    this.loadLookups();
    if (this.initialMotorcycle) {
      this.patchFormWithMotorcycle(this.initialMotorcycle);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialMotorcycle'] && !changes['initialMotorcycle'].firstChange && this.form) {
      this.patchFormWithMotorcycle(changes['initialMotorcycle'].currentValue);
    }
  }

  loadLookups(): void {
    this.storesService.list().subscribe((data) => (this.stores = data));
    this.brandsService.list().subscribe((data) => (this.brands = data));
  }

  onPhotoSelect(event: FileSelectEvent): void {
    event.currentFiles.forEach((file) => {
      const key = this.buildFileKey(file);
      if (this.photoUploads.some((item) => item.key === key)) {
        return;
      }
      const entry = { file, key, previewUrl: null };
      this.photoUploads.push(entry);
      this.generatePreview(entry);
    });
  }

  onPhotoRemove(event: FileRemoveEvent): void {
    const key = this.buildFileKey(event.file);
    this.photoUploads = this.photoUploads.filter((item) => item.key !== key);
  }

  onPhotoClear(): void {
    this.photoUploads = [];
  }

  onManualUpload(event: FileUploadHandlerEvent): void {
    event.files.forEach((file) => {
      const key = this.buildFileKey(file);
      if (this.photoUploads.some((item) => item.key === key)) {
        return;
      }
      const entry = { file, key, previewUrl: null };
      this.photoUploads.push(entry);
      this.generatePreview(entry);
    });
  }

  private patchFormWithMotorcycle(moto: Motorcycle | null): void {
    if (!moto || !this.form) {
      return;
    }

    const toNumber = (value: unknown): number | null => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === 'number') {
        return value;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    this.form.patchValue({
      storeId: moto.store?.id ?? '',
      brandId: moto.brand?.id ?? '',
      modelName: moto.modelName ?? '',
      year: moto.year ?? null,
      modelYear: moto.modelYear ?? null,
      km: moto.km ?? null,
      price: toNumber(moto.price),
      cost: toNumber(moto.cost),
      documentCost: toNumber(moto.documentCost),
      maintenanceCost: toNumber(moto.maintenanceCost),
      downPayment: toNumber(moto.downPayment),
      status: moto.status ?? 'disponivel',
      color: moto.color ?? '',
      description: moto.description ?? '',
      clientName: moto.clientName ?? '',
      clientPhone: moto.clientPhone ?? '',
      vin: moto.vin ?? '',
      plate: moto.plate ?? '',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos minimos',
        detail: 'Informe loja, marca e modelo para salvar.',
      });
      return;
    }

    this.loading = true;
    const isEditing = !!this.initialMotorcycle?.id;
    const payload = {
      ...this.form.value,
      modelYear: this.form.value.modelYear ?? undefined,
      price: this.form.value.price ?? undefined,
      cost: this.form.value.cost ?? undefined,
      documentCost: this.form.value.documentCost ?? undefined,
      maintenanceCost: this.form.value.maintenanceCost ?? undefined,
      downPayment: this.form.value.downPayment ?? undefined,
      km: this.form.value.km ?? undefined,
      vin: this.form.value.vin?.trim() || undefined,
      plate: this.form.value.plate?.trim() || undefined,
    };
    const successMessage = isEditing ? 'Moto atualizada!' : 'Moto cadastrada!';
    const uploadErrorMessage = isEditing
      ? 'Moto atualizada, mas ocorreu um erro ao enviar as fotos.'
      : 'Moto criada, mas ocorreu um erro ao enviar as fotos.';
    const saveErrorMessage = isEditing ? 'Nao foi possivel atualizar.' : 'Nao foi possivel salvar.';

    const save$ = isEditing
      ? this.motorcyclesService.updateMotorcycle(this.initialMotorcycle!.id, payload)
      : this.motorcyclesService.createMotorcycle(payload);

    save$.subscribe({
      next: (savedMotorcycle) => {
        if (this.photoUploads.length > 0) {
          this.motorcyclesService
            .uploadMotorcyclePhotos(savedMotorcycle.id, this.photoUploads.map((item) => item.file))
            .subscribe({
              next: () => this.handleSuccess(savedMotorcycle, successMessage),
              error: () => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: uploadErrorMessage,
                });
              },
            });
          return;
        }

        this.handleSuccess(savedMotorcycle, successMessage);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: saveErrorMessage });
      },
    });
  }

  private handleSuccess(motorcycle: Motorcycle, successMessage: string): void {
    this.loading = false;
    this.photoUploads = [];
    this.photoUploader?.clear();
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: successMessage });

    if (this.editDialog) {
      this.saved.emit(motorcycle);
      return;
    }

    this.router.navigate(['/']);
  }

  private buildFileKey(file: File): string {
    return `${file.name}_${file.size}_${file.lastModified}`;
  }

  private generatePreview(entry: { file: File; previewUrl: string | null }): void {
    const reader = new FileReader();
    reader.onload = () => {
      entry.previewUrl = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(entry.file);
  }
}
