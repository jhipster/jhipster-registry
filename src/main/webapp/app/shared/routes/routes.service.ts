import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Route } from './route.model';
import { SessionStorageService } from 'ng2-webstorage';

@Injectable()
export class JhiRoutesService {

    // Observable sources
    private routeChangedSource = new Subject<Route>();
    private routeDownSource = new Subject<Route>();
    private routeReloadSource = new Subject<boolean>();
    routeChanged$: Observable<Route>;
    routeDown$: Observable<Route>;
    routeReload$: Observable<boolean>;

    constructor(
        private http: Http,
        private sessionStorage: SessionStorageService
    ) {
        this.routeChanged$ = this.routeChangedSource.asObservable();
        this.routeDown$ = this.routeDownSource.asObservable();
        this.routeReload$ = this.routeReloadSource.asObservable();
    }

    findAll(): Observable<Route[]> {
        return this.http.get('/api/routes').map((res: Response) => res.json());
    }

    routeChange(route: Route) {
        this.routeChangedSource.next(route);
    }

    reloadRoutes() {
        this.routeReloadSource.next(true);
    }

    routeDown(route: Route) {
        this.routeDownSource.next(route);
    }

    getSelectedInstance() {
        return this.sessionStorage.retrieve('instanceId');
    }

    storeSelectedInstance(instance) {
        this.sessionStorage.store('instanceId', instance);
    }

}
