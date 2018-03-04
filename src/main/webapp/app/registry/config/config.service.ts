import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JhiConfigService {

    constructor(private http: HttpClient) {}

    getConfigAsYaml(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.yml');
    }

    getConfigAsProperties(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.properties');
    }

    getConfigAsJson(application: string, profile: string, label: string): Observable<any> {
        return this.http.get('config/' + label + '/' + application + '-' + profile + '.json');
    }
}
