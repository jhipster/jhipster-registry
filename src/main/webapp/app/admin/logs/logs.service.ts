import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Log } from './log.model';
import { Route } from '../../shared';

@Injectable()
export class LogsService {
    constructor(private http: Http) { }

    changeLevel(log: Log): Observable<Response> {
        return this.http.put('management/logs', log);
    }

    changeInstanceLevel(instance: Route, log: Log): Observable<Response> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.put(instance.prefix + '/management/logs', log);
        }
        return this.changeLevel(log);
    }

    findAll(): Observable<Log[]> {
        return this.http.get('management/logs').map((res: Response) => res.json());
    }

    findInstanceAll(instance: Route): Observable<Log[]> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get((instance.prefix + '/management/logs')).map((res: Response) => res.json());
        }
        return this.findAll();
    }
}
