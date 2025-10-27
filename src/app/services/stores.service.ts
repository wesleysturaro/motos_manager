import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Store } from '../models/loja.model';

@Injectable({ providedIn: 'root' })
export class StoresService {
  private readonly baseUrl = `${environment.apiUrl}/stores`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Store[]> {
    return this.http.get<Store[]>(this.baseUrl);
  }
}
