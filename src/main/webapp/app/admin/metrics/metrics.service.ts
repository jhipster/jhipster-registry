import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Route } from '../../shared';

@Injectable()
export class JhiMetricsService {

    constructor(private http: Http) {}

    // get the Registry's metrics
    getMetrics(): Observable<any> {
        return this.http.get('management/metrics').map((res: Response) => res.json());
    }

    // get the instance's metrics
    getInstanceMetrics(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get((instance.prefix + '/management/metrics')).map((res: Response) => res.json());
        }
        return this.getMetrics();
    }

    threadDump(): Observable<any> {
        return this.http.get('management/dump').map((res: Response) => res.json());
    }

    instanceThreadDump(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get((instance.prefix + '/management/dump')).map((res: Response) => res.json());
        }
        return this.threadDump();
    }

}
