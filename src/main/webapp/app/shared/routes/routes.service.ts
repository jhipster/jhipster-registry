import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Route } from './route.model';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable()
export class JhiRoutesService {
    // Observable sources
    private routeChangedSource = new Subject<Route>();
    private routesChangedSource = new Subject<Route[]>();
    private routeDownSource = new Subject<Route>();
    private routeReloadSource = new Subject<boolean>();
    routeChanged$: Observable<Route>;
    routesChanged$: Observable<Route[]>;
    routeDown$: Observable<Route>;
    routeReload$: Observable<boolean>;

    constructor(private http: HttpClient, private sessionStorage: SessionStorageService) {
        this.routeChanged$ = this.routeChangedSource.asObservable();
        this.routesChanged$ = this.routesChangedSource.asObservable();
        this.routeDown$ = this.routeDownSource.asObservable();
        this.routeReload$ = this.routeReloadSource.asObservable();
    }

    findAll(): Observable<Route[]> {
        return this.http.get<Route[]>('/api/routes');
    }

    routeChange(route: Route) {
        this.routeChangedSource.next(route);
    }

    routesChange(routes: Route[]) {
      this.routesChangedSource.next(routes);
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
