import { NgModule } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { SessionStorageService } from 'ng2-webstorage';
import { JhiRefreshService } from '../../../main/webapp/app/shared/refresh/refresh.service';

@NgModule({
    providers: [
        MockBackend,
        SessionStorageService,
        JhiRefreshService,
        BaseRequestOptions,
        {
            provide: Http,
            useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backendInstance, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        }
    ]
})
export class JHipsterRegistryTestModule {}
