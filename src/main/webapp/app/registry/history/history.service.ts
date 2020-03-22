import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EurekaHistory {
  canceled: History;
  registered: History;
}

export type History = { [key in number]?: string };

export type EurekaHistoryType = 'registered' | 'canceled';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<EurekaHistory> {
    return this.http.get<EurekaHistory>('api/eureka/lastn');
  }
}
