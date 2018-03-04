import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Route } from '../../shared';

@Injectable()
export class JhiLogfileService {

    constructor(private http: HttpClient) { }

    // get the Registry's logfile
    getLogfile(): Observable<any> {
        return this.http.get('management/logfile').map((res: HttpResponse<any>) => res.body);
    }

    // get the instance's logfile
    getInstanceLogfile(instance: Route): Observable<any> {
        if (instance && instance.prefix && instance.prefix.length > 0) {
            return this.http.get(instance.prefix + '/management/logfile').map((res: HttpResponse<any>) => res.body);
        }
        return this.getLogfile();
    }
}
