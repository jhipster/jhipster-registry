import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JhiSSHService {
    constructor(private http: HttpClient) {}

    getSshPublicKey(): Observable<any> {
        return this.http.get('api/ssh/public_key', { responseType: 'text' });
    }
}
