import { Brand } from './marca.model';
import { Store } from './loja.model';

export interface Motorcycle {
  id: string;
  store?: Store | null;
  brand?: Brand | null;
  modelName: string;
  year?: number | null;
  modelYear?: number | null;
  color?: string | null;
  vin?: string | null;
  plate?: string | null;
  km?: number | null;
  price?: number | string | null;
  cost?: number | string | null;
  status?: string;
  fuel?: string | null;
  engineCc?: number | null;
  powerHp?: number | null;
  torqueNm?: number | null;
  transmission?: string | null;
  abs?: boolean | null;
  description?: string | null;
  hasDocumentation?: boolean | null;
  hasInspection?: boolean | null;
  completenessScore?: number;
  clientName?: string | null;
  clientPhone?: string | null;
  documentCost?: number | string | null;
  maintenanceCost?: number | string | null;
  downPayment?: number | string | null;
  photos?: Array<{ id: string; pathOrUrl: string; isCover: boolean }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotorcycleFilters {
  storeId?: string;
  brandId?: string;
  modelName?: string;
  status?: string;
  year?: number;
  modelYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minKm?: number;
  maxKm?: number;
}
