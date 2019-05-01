import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProfileService } from 'app/layouts/profiles/profile.service';
import { Principal, LoginModalService, LoginService, LoginOAuth2Service } from 'app/shared';

import { VERSION } from 'app/app.constants';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;

    constructor(
        private loginService: LoginService,
        private loginOAuth2Service: LoginOAuth2Service,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private eventManager: JhiEventManager,
        private router: Router
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.getProfileInfo();
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.getProfileInfo();
        });
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.profileService.getProfileInfo().then(profileInfo => {
            if (profileInfo.activeProfiles.indexOf('oauth2') > -1) {
                this.loginOAuth2Service.logout().subscribe(response => {
                    const data = response.body;
                    let logoutUrl = data.logoutUrl;
                    // if Keycloak, uri has protocol/openid-connect/token
                    if (logoutUrl.indexOf('/protocol') > -1) {
                        logoutUrl = logoutUrl + '?redirect_uri=' + window.location.origin;
                    } else {
                        // Okta
                        logoutUrl = logoutUrl + '?id_token_hint=' + data.idToken + '&post_logout_redirect_uri=' + window.location.origin;
                    }
                    window.location.href = logoutUrl;
                });
            } else {
                this.loginService.logout();
                this.router.navigate(['']);
            }
        });
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    getProfileInfo() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }
}
