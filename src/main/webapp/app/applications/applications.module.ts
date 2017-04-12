import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    APPLICATIONS_ROUTE,
    JhiApplicationsComponent,
    JhiApplicationsService
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot([ APPLICATIONS_ROUTE ], {useHash: true})
    ],
    declarations: [
        JhiApplicationsComponent
    ],
    entryComponents: [],
    providers: [
        JhiApplicationsService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class JHipsterRegistryApplicationsModule {}
