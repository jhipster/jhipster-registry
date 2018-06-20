import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable()
export class JhiRefreshService {
    // Observable sources
    private refreshChangedSource = new Subject<any>();
    private refreshReloadSource = new Subject<any>();
    refreshChanged$: Observable<any>;
    refreshReload$: Observable<any>;

    constructor(private sessionStorage: SessionStorageService) {
        this.refreshChanged$ = this.refreshChangedSource.asObservable();
        this.refreshReload$ = this.refreshReloadSource.asObservable();
    }

    refreshChanged() {
        this.refreshChangedSource.next();
    }

    refreshReload() {
        this.refreshReloadSource.next();
    }

    getSelectedRefreshTime(): number {
        return this.sessionStorage.retrieve('refreshTime');
    }

    storeSelectedRefreshTime(time: number) {
        this.sessionStorage.store('refreshTime', time);
    }
}
