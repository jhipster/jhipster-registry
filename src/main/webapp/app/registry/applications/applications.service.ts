import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';

export type InstanceStatus = 'UP' | 'DOWN' | 'STARTING' | 'OUT_OF_SERVICE' | 'UNKNOWN';

export interface Instance {
  name?: string;
  instanceId?: string;
  homePageUrl?: string;
  healthCheckUrl?: string;
  statusPageUrl?: string;
  status?: InstanceStatus;
  metadata?: Record<string, string>;
}

export interface Application {
  name: string;
  instances: Instance[];
}

export interface Eureka {
  applications: Application[];
}

@Service()
export class ApplicationsService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Application[]> {
    return this.http.get<Eureka>(`${serverApiUrl}api/eureka/applications`).pipe(map(eureka => eureka.applications));
  }
}
