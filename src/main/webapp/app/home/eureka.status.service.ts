import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EurekaStatusKey =
  | 'time'
  | 'currentTime'
  | 'upTime'
  | 'environment'
  | 'datacenter'
  | 'isBelowRenewThreshold'
  | 'generalStats'
  | 'instanceInfo';

export interface Eureka {
  status: {
    [key in EurekaStatusKey]?: any;
  };
}

@Injectable({ providedIn: 'root' })
export class EurekaStatusService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Eureka> {
    return this.http.get<Eureka>('api/eureka/status');
  }
}
