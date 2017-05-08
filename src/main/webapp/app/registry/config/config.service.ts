import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiConfigService {

    constructor(private http: Http) {}

    getConfig(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.yml').map((response: Response) => {
            return response.text();
        });
    }
}
