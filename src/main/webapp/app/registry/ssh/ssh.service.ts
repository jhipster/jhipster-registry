import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiSSHService {

    constructor(private http: HttpClient) {}

    getSshPublicKey(): Observable<any> {
        return this.http.get('api/ssh/public_key').map((response: HttpResponse<any>) => {
            return response.body;
        });
    }
}
