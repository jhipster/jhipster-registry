import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiscoveryStatus {
  backend: string;
  status: {
    [key: string]: any;
  };
}

@Injectable({ providedIn: 'root' })
export class DiscoveryStatusService {
  constructor(private http: HttpClient) {}

  /**
   * Get status from the unified discovery API
   */
  findAll(): Observable<DiscoveryStatus> {
    return this.http.get<DiscoveryStatus>('api/discovery/status');
  }

  /**
   * Legacy Eureka status endpoint
   */
  findEurekaStatus(): Observable<{ status: { [key: string]: any } }> {
    return this.http.get<{ status: { [key: string]: any } }>('api/eureka/status');
  }
}
