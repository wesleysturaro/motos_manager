import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InventorySummaryResponse } from '../models/estoque.model';
import { Motorcycle } from '../models/moto.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = `${environment.apiUrl}/inventory`;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<InventorySummaryResponse> {
    return this.http.get<InventorySummaryResponse>(`${this.baseUrl}/summary`);
  }

  getMissing(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(`${this.baseUrl}/missing`);
  }
}
