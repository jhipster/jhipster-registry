import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParseLinks } from 'ng-jhipster';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    adminState,
<<<<<<< HEAD
    LogsComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    JhiConfigurationComponent,
    JhiConfigurationService,
    JhiHealthService,
    JhiMetricsService,
    LogsService
=======
    // LogsComponent,
    // JhiMetricsMonitoringModalComponent,
    // JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    // JhiConfigurationComponent,
    // JhiConfigurationService,
    JhiHealthService,
    // JhiMetricsService,
    // LogsService
>>>>>>> refs/remotes/origin/angular-2
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot(adminState, { useHash: true })
    ],
    declarations: [
<<<<<<< HEAD
        LogsComponent,
        JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        JhiConfigurationService,
        JhiHealthService,
        JhiMetricsService,
        LogsService
=======
        // LogsComponent,
        // JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        // JhiMetricsMonitoringComponent,
        // JhiMetricsMonitoringModalComponent
    ],
    entryComponents: [
        JhiHealthModalComponent,
        // JhiMetricsMonitoringModalComponent,
    ],
    providers: [
        // JhiConfigurationService,
        JhiHealthService,
        // JhiMetricsService,
        // LogsService
>>>>>>> refs/remotes/origin/angular-2
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryAdminModule {}
