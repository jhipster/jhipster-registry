import { Injectable } from '@angular/core';
import { Principal } from 'app/core/auth/principal.service';
import { AuthSessionServerProvider } from 'app/core/auth/auth-session.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { map } from 'rxjs/operators';

@Injectable()
export class LoginOAuth2Service {
    constructor(private http: HttpClient) {}

    login() {
        let port = location.port ? ':' + location.port : '';
        if (port === ':9000') {
            port = ':8761';
        }
        let contextPath = location.pathname;
        if (contextPath.endsWith('accessdenied')) {
            contextPath = contextPath.substring(0, contextPath.indexOf('accessdenied'));
        }
        if (!contextPath.endsWith('/')) {
            contextPath = contextPath + '/';
        }
        // If you have configured multiple OIDC providers, then, you can update this URL to /login.
        // It will show a Spring Security generated login page with links to configured OIDC providers.
        location.href = `//${location.hostname}${port}${contextPath}oauth2/authorization/oidc`;
    }

    logout(): Observable<any> {
        // logout from the server
        return this.http.post(SERVER_API_URL + 'api/logout', {}, { observe: 'response' }).pipe(
            map((response: HttpResponse<any>) => {
                return response;
            })
        );
    }
}
