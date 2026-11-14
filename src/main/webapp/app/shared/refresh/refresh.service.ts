import { Service } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Service()
export class RefreshService {
  readonly refreshChanged$: Observable<void>;
  readonly refreshReload$: Observable<void>;

  private readonly refreshTimeKey = 'jhi-refreshTime';
  private readonly refreshChangedSource = new Subject<void>();
  private readonly refreshReloadSource = new Subject<void>();

  constructor() {
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
    return Number(sessionStorage.getItem(this.refreshTimeKey) ?? 0);
  }

  storeSelectedRefreshTime(time: number): void {
    sessionStorage.setItem(this.refreshTimeKey, String(time));
  }
}
