import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class JhiReplicasService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get('api/eureka/replicas').pipe(map((res: HttpResponse<any>) => res.body));
  }
}
