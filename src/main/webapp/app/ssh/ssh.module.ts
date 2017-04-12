import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    sshState,
    JhiSSHComponent,
    JhiSSHService
} from './';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot( sshState , {useHash: true})
    ],
    declarations: [
        JhiSSHComponent
    ],
    entryComponents: [],
    providers: [
        JhiSSHService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class JHipsterRegistrySSHModule {}
