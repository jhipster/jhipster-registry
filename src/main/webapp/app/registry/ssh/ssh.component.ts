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

  unSubscribe$ = new Subject();

  constructor(private sshService: JhiSSHService) {
    this.showMore = true;
  }

  ngOnInit() {
    this.sshService
      .getSshPublicKey()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(response => {
        this.data = response;
      });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
