import { Injectable } from '@angular/core';
import { Principal } from 'app/core/auth/principal.service';
import { AuthSessionServerProvider } from 'app/core/auth/auth-session.service';

@Injectable()
export class LoginOAuth2Service {
    constructor(private principal: Principal, private authServerProvider: AuthSessionServerProvider) {}

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

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
