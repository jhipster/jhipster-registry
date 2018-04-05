import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthSessionServerProvider {
    constructor(private http: HttpClient) {}

    login(credentials): Observable<any> {
        const data =
            'j_username=' +
            encodeURIComponent(credentials.username) +
            '&j_password=' +
            encodeURIComponent(credentials.password) +
            '&remember-me=' +
            credentials.rememberMe +
            '&submit=Login';
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post('api/authentication', data, { headers });
    }

    logout(): Observable<any> {
        // logout from the server
        return this.http.post('api/logout', {}, { observe: 'response' }).map((response: HttpResponse<any>) => {
            // to get a new csrf token call the api
            this.http.get('api/account').subscribe(() => {}, () => {});
            return response;
        });
    }
}
