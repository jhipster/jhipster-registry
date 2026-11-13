import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

@Service()
export class ReplicasService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(`${serverApiUrl}api/eureka/replicas`);
  }
}
