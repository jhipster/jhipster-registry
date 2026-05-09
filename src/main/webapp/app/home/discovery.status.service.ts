import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiscoveryStatus {
  backend: string;
  status: {
    [key: string]: any;
  };
}

export interface EurekaStatusResponse {
  status: {
    [key: string]: any;
  };
}

@Injectable({ providedIn: 'root' })
export class DiscoveryStatusService {
  constructor(private http: HttpClient) {}

  /**
   * Get status from the unified discovery API.
   * Works with any active backend (Eureka, Consul, Kubernetes).
   */
  findAll(): Observable<DiscoveryStatus> {
    return this.http.get<DiscoveryStatus>('api/discovery/status');
  }

  /**
   * Fallback to the legacy Eureka status endpoint.
   * Used when the unified API is not available.
   */
  findEurekaStatus(): Observable<EurekaStatusResponse> {
    return this.http.get<EurekaStatusResponse>('api/eureka/status');
  }
}
