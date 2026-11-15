import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

export interface EurekaStatus {
  time?: string;
  currentTime?: string;
  upTime?: string;
  environment?: string;
  datacenter?: string;
  isBelowRenewThreshold?: boolean;
  generalStats?: Record<string, string>;
  instanceInfo?: { ipAddr?: string; status?: string };
}

export interface Eureka {
  status: EurekaStatus;
}

@Service()
export class EurekaStatusService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<Eureka> {
    return this.http.get<Eureka>(`${serverApiUrl}api/eureka/status`);
  }
}
