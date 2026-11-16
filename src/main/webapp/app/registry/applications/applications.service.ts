import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Application {
  name: string;
  instances: Array<Instance>;
  active?: string;
}

export type InstanceKey = 'name' | 'instanceId' | 'homePageUrl' | 'healthCheckUrl' | 'statusPageUrl' | 'status' | 'metadata';

export type Instance = { [key in InstanceKey]?: any };

export type InstanceStatus = 'UP' | 'DOWN' | 'STARTING' | 'OUT_OF_SERVICE' | 'UNKNOWN';

export type DiscoveryBackend = 'eureka' | 'consul' | 'kubernetes' | string;

export interface Discovery {
  backend: DiscoveryBackend;
  applications: Array<Application>;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Discovery> {
    return this.http.get<Discovery>('api/applications');
  }
}
