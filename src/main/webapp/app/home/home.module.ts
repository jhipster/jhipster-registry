import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent } from './';
import { EurekaStatusService } from './eureka.status.service';


@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot([ HOME_ROUTE ], { useHash: true })
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [
    ],
    providers: [
        EurekaStatusService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryHomeModule {}
