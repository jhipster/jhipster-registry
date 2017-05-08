/* tslint:disable:no-access-missing-member */
// TODO lint disabled as the filter pipe used in template seems to trigger this
import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiApplicationsService } from './applications.service';
import { JhiRefreshService } from '../../shared/refresh/refresh.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-applications',
    templateUrl: './applications.component.html',
    styleUrls: [
        'applications.component.scss'
    ]
})
export class JhiApplicationsComponent implements OnInit, OnDestroy {
    application: any;
    data: any;
    instances: any;

    refreshReloadSubscription: Subscription;
    applicationsServiceSubscription: Subscription;

    constructor(
        private applicationsService: JhiApplicationsService,
        private refreshService: JhiRefreshService
    ) {}

    ngOnInit() {
        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe((empty) => this.refresh());
        this.refresh();
    }

    ngOnDestroy() {
        this.refreshReloadSubscription.unsubscribe();
        this.applicationsServiceSubscription.unsubscribe();
    }

    refresh() {
        this.applicationsServiceSubscription = this.applicationsService.findAll().subscribe((data) => {
            this.data = data;
            if (data.applications.length > 0) {
                this.show(data.applications[0].name);
            }
        });
    }

    show(app) {
        this.application = app;
        for (const application of this.data.applications) {
            application.active = '';
            if (application.name === this.application) {
                this.instances = application.instances;
                application.active = 'active';
            }
        }
    }

    getBadgeClass(statusState) {
        if (statusState && statusState === 'UP') {
            return 'badge-success';
        } else {
            return 'badge-danger';
        }
    }

}
