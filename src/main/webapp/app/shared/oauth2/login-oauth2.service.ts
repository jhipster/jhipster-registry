import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthSessionServerProvider } from '../auth/auth-session.service';

@Injectable()
export class LoginOAuth2Service {

    constructor(
        private principal: Principal,
        private authServerProvider: AuthSessionServerProvider
    ) {}

    login() {
        let port = (location.port ? ':' + location.port : '');
        if (port === ':9000') {
            port = ':8761';
        }
        location.href = '//' + location.hostname + port + '/login';
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    }
}
