import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route } from 'app/shared';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable()
export class JhiMetricsService {
    constructor(private http: HttpClient) {}

    // get the Registry's metrics
    getMetrics(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/jhimetrics');
    }

    // get the instance's metrics
    getInstanceMetrics(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get(instance.prefix + '/management/jhimetrics');
        }
        return this.getMetrics();
    }

    threadDump(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/threaddump');
    }

    instanceThreadDump(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get(instance.prefix + '/management/threaddump');
        }
        return this.threadDump();
    }
}
