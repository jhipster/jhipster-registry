import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import {Route} from './route.model';

@Injectable()
export class JhiRoutesService {

    constructor(private http: Http) { }

    findAll(): Observable<Route[]> {
        return this.http.get('/api/routes').map((res: Response) => res.json());
    }

}
