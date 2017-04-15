import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Route } from './route.model';

@Injectable()
export class JhiRoutesService {

    // Observable string sources
    private routeChangedSource = new Subject<Route>();
    routeChanged$: Observable<Route>;

    constructor(private http: Http) {
        this.routeChanged$ = this.routeChangedSource.asObservable();
    }

    findAll(): Observable<Route[]> {
        return this.http.get('/api/routes').map((res: Response) => res.json());
    }

    routeChange(route: Route) {
        this.routeChangedSource.next(route);
    }
}
