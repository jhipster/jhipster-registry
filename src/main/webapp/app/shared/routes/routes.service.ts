import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route } from './route.model';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoutesService {
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

  routeChange(route: Route | undefined): void {
    this.routeChangedSource.next(route);
  }

  routesChange(routes: Route[]): void {
    this.routesChangedSource.next(routes);
  }

  reloadRoutes(): void {
    this.routeReloadSource.next(true);
  }

  routeDown(route: Route | undefined): void {
    this.routeDownSource.next(route);
  }

  getSelectedInstance(): Route {
    return this.sessionStorage.retrieve('instanceId');
  }

  storeSelectedInstance(instance: Route | undefined): void {
    this.sessionStorage.store('instanceId', instance);
  }
}
