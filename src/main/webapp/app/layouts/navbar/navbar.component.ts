import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProfileService } from 'app/layouts/profiles/profile.service';
import { Principal, LoginModalService, LoginService, LoginUAAService, LoginUAAModalService } from 'app/shared';

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
    activeProfiles: string[];

    constructor(
        private loginService: LoginService,
        private loginUAAService: LoginUAAService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private loginUAAModalService: LoginUAAModalService,
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
        this.eventManager.subscribe('authenticationSuccess', (message) => {
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
        if (this.activeProfiles.indexOf('uaa') > -1) {
            this.modalRef = this.loginUAAModalService.open();
        } else {
            this.modalRef = this.loginModalService.open();
        }
    }

    logout() {
        this.collapseNavbar();
        if (this.activeProfiles.indexOf('uaa') > -1) {
            this.loginUAAService.logout();
        } else {
            this.loginService.logout();
        }
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    getProfileInfo() {
        this.profileService.getProfileInfo().then((profileInfo) => {
            this.activeProfiles = profileInfo.activeProfiles;
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }
}
