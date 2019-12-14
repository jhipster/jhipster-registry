import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { Route } from 'app/shared/routes/route.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  constructor(private http: HttpClient) {}

  changeLevel(name: string, configuredLevel: string): Observable<HttpResponse<any>> {
    return this.http.post(SERVER_API_URL + 'management/loggers/' + name, { configuredLevel }, { observe: 'response' });
  }

  changeInstanceLevel(instances: Route[], name: string, configuredLevel: string): Observable<any> {
    const changeInstanceLevelResponses: Observable<HttpResponse<any>>[] = [];
    for (let i = 0; i < instances.length; i++) {
      if (instances[i] && instances[i].prefix && instances[i].prefix.length > 0) {
        changeInstanceLevelResponses.push(
          this.http.post(instances[i].prefix + '/management/loggers/' + name, { configuredLevel }, { observe: 'response' })
        );
      } else {
        changeInstanceLevelResponses.push(this.changeLevel(name, configuredLevel));
      }
    }

    return forkJoin(changeInstanceLevelResponses);
  }

  findAll(): Observable<HttpResponse<any>> {
    return this.http.get<any>(SERVER_API_URL + 'management/loggers', { observe: 'response' });
  }

  findInstanceAll(instance: Route): Observable<HttpResponse<any>> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.http.get<any>(instance.prefix + '/management/loggers', { observe: 'response' });
    }
    return this.findAll();
  }
}
