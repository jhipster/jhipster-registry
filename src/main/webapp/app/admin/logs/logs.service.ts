import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { Log } from './log.model';
import { Route } from 'app/shared';

@Injectable()
export class LogsService {
    constructor(private http: HttpClient) {}

    changeLevel(log: Log): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + 'management/logs', log, { observe: 'response' });
    }

    changeInstanceLevel(instance: Route, log: Log): Observable<HttpResponse<any>> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.put(instance.prefix + '/management/logs', log, { observe: 'response' });
        }
        return this.changeLevel(log);
    }

    findAll(): Observable<HttpResponse<Log[]>> {
        return this.http.get<Log[]>(SERVER_API_URL + 'management/logs', { observe: 'response' });
    }

    findInstanceAll(instance: Route): Observable<HttpResponse<Log[]>> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get<Log[]>(instance.prefix + '/management/logs', { observe: 'response' });
        }
        return this.findAll();
    }
}
