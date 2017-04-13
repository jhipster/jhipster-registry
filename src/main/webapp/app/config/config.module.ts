import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import {
    CONFIG_ROUTE,
    JhiConfigComponent,
    JhiConfigService
} from './';

@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot([CONFIG_ROUTE], {useHash: true})
    ],
    declarations: [
        JhiConfigComponent
    ],
    entryComponents: [],
    providers: [
        JhiConfigService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryConfigModule {}
