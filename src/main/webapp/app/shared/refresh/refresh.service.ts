import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  // Observable sources
  private refreshChangedSource = new Subject<any>();
  private refreshReloadSource = new Subject<any>();
  refreshChanged$: Observable<any>;
  refreshReload$: Observable<any>;

  constructor(private sessionStorage: SessionStorageService) {
    this.refreshChanged$ = this.refreshChangedSource.asObservable();
    this.refreshReload$ = this.refreshReloadSource.asObservable();
  }

  refreshChanged(): void {
    this.refreshChangedSource.next();
  }

  refreshReload(): void {
    this.refreshReloadSource.next();
  }

  getSelectedRefreshTime(): number {
    return this.sessionStorage.retrieve('refreshTime');
  }

  storeSelectedRefreshTime(time: number): void {
    this.sessionStorage.store('refreshTime', time);
  }
}
