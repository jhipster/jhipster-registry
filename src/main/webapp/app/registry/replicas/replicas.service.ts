import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReplicasService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Array<string>> {
    return this.http.get<Array<string>>('api/eureka/replicas');
  }
}
