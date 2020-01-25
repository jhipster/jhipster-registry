import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { Route } from 'app/shared/routes/route.model';
import { Level, LoggersResponse } from 'app/admin/logs/log.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  constructor(private http: HttpClient) {}

  changeLevel(name: string, configuredLevel: Level): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'management/loggers/' + name, { configuredLevel });
  }

  changeInstanceLevel(instances: Route[], name: string, configuredLevel: Level): Observable<{}> {
    const changeInstanceLevelResponses: Observable<{}>[] = [];
    for (let i = 0; i < instances.length; i++) {
      if (instances[i] && instances[i].prefix && instances[i].prefix.length > 0) {
        changeInstanceLevelResponses.push(this.http.post(instances[i].prefix + '/management/loggers/' + name, { configuredLevel }));
      } else {
        changeInstanceLevelResponses.push(this.changeLevel(name, configuredLevel));
      }
    }

    return forkJoin(changeInstanceLevelResponses);
  }

  findAll(): Observable<LoggersResponse> {
    return this.http.get<LoggersResponse>(SERVER_API_URL + 'management/loggers');
  }

  findInstanceAll(instance: Route | undefined): Observable<LoggersResponse> {
    if (instance && instance.prefix && instance.prefix.length > 0) {
      return this.http.get<LoggersResponse>(instance.prefix + '/management/loggers');
    }
    return this.findAll();
  }
}
