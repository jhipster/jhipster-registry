import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EurekaStatusService {
    constructor(private http: HttpClient) {}

    findAll(): Observable<any> {
        return this.http.get('api/eureka/status');
    }
}
