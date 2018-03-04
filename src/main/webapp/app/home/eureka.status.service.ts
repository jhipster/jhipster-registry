import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class EurekaStatusService {

    constructor(private http: HttpClient) { }

    findAll(): Observable<any> {
        return this.http.get('api/eureka/status');
    }
}
