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

export interface Eureka {
  applications: Array<Application>;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Array<Application>> {
    return this.http.get<Eureka>('api/eureka/applications').pipe(map(eureka => eureka.applications));
  }
}
