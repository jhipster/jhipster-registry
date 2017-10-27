import { NgModule } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { SessionStorageService } from 'ng2-webstorage';
import { JhiRefreshService } from '../../../main/webapp/app/shared/refresh/refresh.service';
import { LoginOAuth2Service } from '../../../main/webapp/app/shared/oauth2/login-oauth2.service';
import { AuthSessionServerProvider } from '../../../main/webapp/app/shared/auth/auth-session.service';
import { ProfileService } from '../../../main/webapp/app/layouts/profiles/profile.service';

@NgModule({
    providers: [
        MockBackend,
        SessionStorageService,
        JhiRefreshService,
        LoginOAuth2Service,
        AuthSessionServerProvider,
        ProfileService,
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
