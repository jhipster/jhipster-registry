import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiHistoryService {

    constructor(private http: HttpClient) {}

    findAll(): Observable<any> {
        return this.http.get('api/eureka/lastn');
    }
}
