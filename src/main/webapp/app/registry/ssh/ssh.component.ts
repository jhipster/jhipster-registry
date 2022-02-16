import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SSHService } from './ssh.service';

@Component({
  selector: 'jhi-applications',
  templateUrl: './ssh.component.html',
})
export class SSHComponent implements OnInit, OnDestroy {
  data?: string;
  showMore: boolean;
  unsubscribe$ = new Subject();

  constructor(private sshService: SSHService) {
    this.showMore = true;
  }

  ngOnInit(): void {
    this.sshService
      .getSshPublicKey()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => (this.data = response));
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
