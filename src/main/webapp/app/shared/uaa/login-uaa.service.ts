import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthUAAServerProvider } from './auth-uaa.service';

@Injectable()
export class LoginUAAService {

    constructor(
        private principal: Principal,
        private authServerProvider: AuthUAAServerProvider
    ) {}

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                this.principal.identity(true).then((account) => {
                    resolve(data);
                });
                return cb();
            }, (err) => {
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }

    logout() {
        if (this.principal.isAuthenticated()) {
            this.authServerProvider.logout().subscribe(() => this.principal.authenticate(null));
        } else {
            this.principal.authenticate(null);
        }
    }
}
