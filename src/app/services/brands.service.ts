import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Brand } from '../models/marca.model';

@Injectable({ providedIn: 'root' })
export class BrandsService {
  private readonly baseUrl = `${environment.apiUrl}/brands`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl);
  }
}
