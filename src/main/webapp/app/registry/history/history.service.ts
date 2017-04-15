import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiHistoryService {

    constructor(private http: Http) {}

    findAll(): Observable<any> {
        return this.http.get('api/eureka/lastn').map((res: Response) => res.json());
    }
}
