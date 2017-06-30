import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiConfigService {

    constructor(private http: Http) {}

    getConfigAsYaml(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.yml').map((response: Response) => {
            return response.text();
        });
    }

    getConfigAsProperties(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.properties').map((response: Response) => {
            return response.text();
        });
    }

    getConfigAsJson(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.json').map((response: Response) => {
            return response.text();
        });
    }
}
