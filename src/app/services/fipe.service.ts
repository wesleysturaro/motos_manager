import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FipeBrand {
  nome: string;
  codigo: string;
}

export interface FipeModel {
  nome: string;
  codigo: string;
}

export interface FipeYear {
  nome: string;
  codigo: string;
}

export interface FipePriceResponse {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
}

@Injectable({ providedIn: 'root' })
export class FipeService {
  private readonly baseUrl = 'https://parallelum.com.br/fipe/api/v1/motos';

  constructor(private readonly http: HttpClient) {}

  getBrands(): Observable<FipeBrand[]> {
    return this.http.get<FipeBrand[]>(`${this.baseUrl}/marcas`);
  }

  getModels(brandCode: string): Observable<FipeModel[]> {
    return this.http
      .get<{ modelos: FipeModel[] }>(`${this.baseUrl}/marcas/${brandCode}/modelos`)
      .pipe(map((res) => res?.modelos ?? []));
  }

  getYears(brandCode: string, modelCode: string): Observable<FipeYear[]> {
    return this.http.get<FipeYear[]>(
      `${this.baseUrl}/marcas/${brandCode}/modelos/${modelCode}/anos`,
    );
  }

  getPrice(brandCode: string, modelCode: string, yearCode: string): Observable<FipePriceResponse> {
    return this.http.get<FipePriceResponse>(
      `${this.baseUrl}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`,
    );
  }

  parsePrice(value: string): number | null {
    if (!value) return null;
    const numeric = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(numeric);
    return Number.isFinite(parsed) ? parsed : null;
  }

  parseYear(value: string): number | null {
    if (!value) return null;
    const match = value.match(/\d{4}/);
    return match ? Number(match[0]) : null;
  }
}
