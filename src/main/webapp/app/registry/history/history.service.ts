import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiscoveryHistory {
  registered: { [key: string]: string };
  canceled: { [key: string]: string };
}

export type EurekaHistoryType = 'registered' | 'canceled';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  constructor(private http: HttpClient) {}

  /**
   * Get registration history from the unified discovery API.
   * Falls back to Eureka-specific endpoint if needed.
   */
  findAll(): Observable<DiscoveryHistory> {
    return this.http.get<DiscoveryHistory>('api/eureka/lastn');
  }
}
