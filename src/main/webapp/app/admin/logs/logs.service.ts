import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { Log } from './log.model';
import { Route } from 'app/shared';

@Injectable()
export class LogsService {
    constructor(private http: HttpClient) {}

    changeLevel(name: string, configuredLevel: string): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'management/loggers/' + name, { configuredLevel }, { observe: 'response' });
    }

    changeInstanceLevel(instance: Route, name: string, configuredLevel: string): Observable<HttpResponse<any>> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.post(instance.prefix + '/management/loggers/' + name, { configuredLevel }, { observe: 'response' });
        }
        return this.changeLevel(name, configuredLevel);
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
