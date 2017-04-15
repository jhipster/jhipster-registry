import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JHipsterRegistrySharedModule } from '../shared';

import {
    SSH_ROUTE,
    JhiSSHComponent,
    JhiSSHService
} from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule,
        RouterModule.forRoot([SSH_ROUTE], {useHash: true})
    ],
    declarations: [
        JhiSSHComponent
    ],
    entryComponents: [],
    providers: [
        JhiSSHService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistrySSHModule {}
