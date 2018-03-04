import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JhiApplicationsService {
    constructor(private http: HttpClient) {}

    findAll(): Observable<any> {
        return this.http.get('api/eureka/applications');
    }
}
