import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  // Observable sources
  refreshChanged$: Observable<any>;
  refreshReload$: Observable<any>;
  private refreshChangedSource = new Subject<any>();
  private refreshReloadSource = new Subject<any>();

  constructor(private sessionStorage: SessionStorageService) {
    this.refreshChanged$ = this.refreshChangedSource.asObservable();
    this.refreshReload$ = this.refreshReloadSource.asObservable();
  }

  refreshChanged(): void {
    this.refreshChangedSource.next(null);
  }

  refreshReload(): void {
    this.refreshReloadSource.next(null);
  }

  getSelectedRefreshTime(): number {
    return this.sessionStorage.retrieve('refreshTime') as number;
  }

  storeSelectedRefreshTime(time: number): void {
    this.sessionStorage.store('refreshTime', time);
  }
}
