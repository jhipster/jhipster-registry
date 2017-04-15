import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { JHipsterRegistrySharedModule } from '../shared';

import { JhiRoutesService } from './';

@NgModule({
    imports: [
        JHipsterRegistrySharedModule
    ],
    entryComponents: [],
    providers: [
        JhiRoutesService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryRoutesModule {}
