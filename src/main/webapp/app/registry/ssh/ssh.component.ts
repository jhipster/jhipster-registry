import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JhiSSHService } from './ssh.service';

@Component({
  selector: 'jhi-applications',
  templateUrl: './ssh.component.html'
})
export class JhiSSHComponent implements OnInit, OnDestroy {
  data: any;
  showMore: boolean;
  unsubscribe$ = new Subject();

  constructor(private sshService: JhiSSHService) {
    this.showMore = true;
  }

  ngOnInit() {
    this.sshService
      .getSshPublicKey()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => (this.data = response));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
