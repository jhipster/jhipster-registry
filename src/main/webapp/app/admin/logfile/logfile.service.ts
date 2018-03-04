import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route } from 'app/shared';

@Injectable()
export class JhiLogfileService {
    constructor(private http: HttpClient) {}

    // get the Registry's logfile
    getLogfile(): Observable<any> {
        return this.http.get('management/logfile', { responseType: 'text' });
    }

    // get the instance's logfile
    getInstanceLogfile(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get(instance.prefix + '/management/logfile', { responseType: 'text' });
        }
        return this.getLogfile();
    }
}
