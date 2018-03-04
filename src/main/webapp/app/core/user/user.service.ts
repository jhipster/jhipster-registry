import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { User } from './user.model';

@Injectable()
export class UserService {
    private resourceUrl = SERVER_API_URL + 'api/users';

    constructor(private http: HttpClient) {}

    create(user: User): Observable<HttpResponse<User>> {
        return this.http.post(this.resourceUrl, user, { observe: 'response' });
    }

    update(user: User): Observable<HttpResponse<User>> {
        return this.http.put(this.resourceUrl, user, { observe: 'response' });
    }

    find(login: string): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<User[]>> {
        const options = createRequestOption(req);
        return this.http.get<User[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(login: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }
}
