import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterRegistrySharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent } from './';
import { EurekaStatusService } from './eureka.status.service';
import { JhiLoginModalComponent } from '../shared/login/login.component';

@NgModule({
    imports: [
        JhipsterRegistrySharedModule,
        RouterModule.forRoot([HOME_ROUTE], {useHash: true})
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [
        JhiLoginModalComponent
    ],
    providers: [
        EurekaStatusService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JHipsterRegistryHomeModule {}
