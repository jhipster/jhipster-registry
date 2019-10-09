import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from 'app/types/custom';

@Injectable()
export class AccountService {
    constructor(private http: HttpClient) {}

    get(): Observable<HttpResponse<User>> {
        return this.http.get<User>('api/account', { observe: 'response' });
    }

    save(account: any): Observable<HttpResponse<any>> {
        return this.http.post('api/account', account, { observe: 'response' });
    }
}
