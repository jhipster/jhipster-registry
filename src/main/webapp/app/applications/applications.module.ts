import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {JhipsterRegistrySharedModule} from '../shared';

import {
    applicationsState,
    JhiApplicationsComponent,
    JhiApplicationsService
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot(applicationsState, {useHash: true})
    ],
    declarations: [
        JhiApplicationsComponent
    ],
    entryComponents: [],
    providers: [
        JhiApplicationsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryApplicationsModule {}
