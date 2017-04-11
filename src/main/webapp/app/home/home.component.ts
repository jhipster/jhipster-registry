import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { JhiHealthService } from '../admin';
import { JhiApplicationsService } from '../applications';

import { VERSION } from '../app.constants';
import { EurekaStatusService } from './eureka.status.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
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
                private eventManager: EventManager,
                private eurekaStatusService: EurekaStatusService,
                private applicationsService: JhiApplicationsService,
                private healthService: JhiHealthService) {
        this.version = 'v' + VERSION;
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
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    populateDashboard() {
        this.eurekaStatusService.findAll().subscribe(data => {
            this.status = data.status;
        });

        this.applicationsService.findAll().subscribe(data => {
            for (let app of data.applications) {
                for (let inst of app.instances) {
                    inst.name = app.name;
                    this.appInstances.push(inst);
                }
            }
        });

        this.healthService.checkHealth().subscribe(response => {
            this.healthData = this.healthService.transformHealthData(response);
            this.updatingHealth = false;
        }, response => {
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

    getTagClass(statusState) {
        if (statusState === 'UP') {
            return 'label-success';
        } else {
            return 'label-danger';
        }
    }
}
