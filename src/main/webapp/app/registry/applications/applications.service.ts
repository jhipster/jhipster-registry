import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Application {
  name: string;
  instances: Array<Instance>;
  active?: string;
}

export type InstanceKey = 'name' | 'instanceId' | 'homePageUrl' | 'healthCheckUrl' | 'statusPageUrl' | 'status' | 'metadata';

export type Instance = { [key in InstanceKey]?: any };

export type InstanceStatus = 'UP' | 'DOWN' | 'STARTING' | 'OUT_OF_SERVICE' | 'UNKNOWN';

export interface DiscoveryResponse {
  backend: string;
  applications: Array<Application>;
}

export interface BackendInfo {
  name: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  /**
   * Get the active discovery backend name
   */
  getBackend(): Observable<string> {
    return this.http.get<{ name: string; active: string }>('api/discovery/backend').pipe(
      map(response => response.name)
    );
  }

  /**
   * Get all available backends
   */
  getBackends(): Observable<Array<BackendInfo>> {
    return this.http.get<Array<BackendInfo>>('api/discovery/backends');
  }

  /**
   * Get applications from the unified discovery API
   */
  findAll(): Observable<Array<Application>> {
    return this.http.get<DiscoveryResponse>('api/discovery/applications').pipe(
      map(response => response.applications)
    );
  }

  /**
   * Legacy Eureka endpoint - kept for backward compatibility
   */
  findAllFromEureka(): Observable<Array<Application>> {
    interface Eureka { applications: Array<Application> }
    return this.http.get<Eureka>('api/eureka/applications').pipe(map(eureka => eureka.applications));
  }
}
