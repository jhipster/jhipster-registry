import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

export type History = Record<number, string>;

export interface EurekaHistory {
  canceled: History;
  registered: History;
}

export type EurekaHistoryType = 'registered' | 'canceled';

@Service()
export class HistoryService {
  private readonly http = inject(HttpClient);

  findAll(): Observable<EurekaHistory> {
    return this.http.get<EurekaHistory>(`${serverApiUrl}api/eureka/lastn`);
  }
}
