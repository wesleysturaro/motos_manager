import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Motorcycle, MotorcycleFilters } from '../models/moto.model';

@Injectable({ providedIn: 'root' })
export class MotorcyclesService {
  private readonly baseUrl = `${environment.apiUrl}/motorcycles`;

  constructor(private readonly http: HttpClient) {}

  getMotorcycles(filters: MotorcycleFilters = {}): Observable<Motorcycle[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<Motorcycle[]>(this.baseUrl, { params });
  }

  getMotorcycle(id: string): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${this.baseUrl}/${id}`);
  }

  createMotorcycle(payload: Partial<Motorcycle>): Observable<Motorcycle> {
    return this.http.post<Motorcycle>(this.baseUrl, payload);
  }

  updateMotorcycle(id: string, payload: Partial<Motorcycle>): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${this.baseUrl}/${id}`, payload);
  }

  deleteMotorcycle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadMotorcyclePhotos(id: string, files: File[], urls: string[] = []): Observable<Motorcycle> {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    urls.forEach((url) => formData.append('urls', url));
    return this.http.post<Motorcycle>(`${this.baseUrl}/${id}/photos`, formData);
  }
}
