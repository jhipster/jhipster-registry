import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class JhiSSHService {

    constructor(private http: Http) {}

    getSshPublicKey(): Observable<any> {
        return this.http.get('api/ssh/public_key').map((response: Response) => {
            return response.text();
        });
    }
}
