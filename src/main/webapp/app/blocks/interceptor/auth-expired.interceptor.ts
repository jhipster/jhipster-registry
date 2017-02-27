import { HttpInterceptor } from 'ng-jhipster';
import { RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';
import { AuthServerProvider } from '../../shared/auth/auth-session.service';
import { StateStorageService } from '../../shared/auth/state-storage.service';
import { LoginModalService } from '../../shared/login/login-modal.service';

export class AuthExpiredInterceptor extends HttpInterceptor {

    constructor(private injector: Injector,
        private stateStorageService: StateStorageService) {

        super();
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }
    responseIntercept(observable: Observable<Response>): Observable<Response> {
        let self = this;

        return <Observable<Response>> observable.catch((error) => {
            if (error.status === 401 && error.text() !== '' && error.json().path && error.json().path.indexOf('/api/account') === -1) {
                let authServerProvider = self.injector.get(AuthServerProvider);
                let destination = this.stateStorageService.getDestinationState();
                let to = destination.destination;
                let toParams = destination.params;
                authServerProvider.logout();

                if (to.name === 'accessdenied') {
                    self.stateStorageService.storePreviousState(to.name, toParams);
                }

                let loginServiceModal = self.injector.get(LoginModalService);
                loginServiceModal.open();

            }
            return Observable.throw(error);
        });
    }
}
