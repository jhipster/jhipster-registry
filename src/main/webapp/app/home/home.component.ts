import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { JhiHealthService } from '../admin';
import { JhiApplicationsService } from '../registry';

import { VERSION } from '../app.constants';
import { EurekaStatusService } from './eureka.status.service';
import { ProfileService } from '../layouts/profiles/profile.service';
import { LoginOAuth2Service } from '../shared/oauth2/login-oauth2.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    updatingHealth: boolean;
    healthData: any;
    appInstances: any;
    status: any;
    version: string;

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private loginOAuth2Service: LoginOAuth2Service,
                private eventManager: EventManager,
                private eurekaStatusService: EurekaStatusService,
                private applicationsService: JhiApplicationsService,
                private healthService: JhiHealthService,
                private profileService: ProfileService) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.appInstances = [];
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
            if (!account || !this.isAuthenticated()) {
                this.login();
            } else {
                this.populateDashboard();
            }
        });

        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
                this.populateDashboard();
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            if (profileInfo.activeProfiles.indexOf('oauth2') > -1) {
                this.loginOAuth2Service.login();
            } else {
                this.modalRef = this.loginModalService.open();
            }
        });
    }

    populateDashboard() {
        this.eurekaStatusService.findAll().subscribe((data) => {
            this.status = data.status;
        });

        this.applicationsService.findAll().subscribe((data) => {
            for (const app of data.applications) {
                for (const inst of app.instances) {
                    inst.name = app.name;
                    this.appInstances.push(inst);
                }
            }
        });

        this.healthService.checkHealth().subscribe((response) => {
            this.healthData = this.healthService.transformHealthData(response);
            this.updatingHealth = false;
        }, (response) => {
            this.healthData = this.healthService.transformHealthData(response.data);
            this.updatingHealth = false;
        });
    }

    baseName(name: string) {
        return this.healthService.getBaseName(name);
    }

    subSystemName(name: string) {
        this.healthService.getSubSystemName(name);
    }

    getBadgeClass(statusState) {
        if (statusState === 'UP') {
            return 'badge-success';
        } else {
            return 'badge-danger';
        }
    }
}
