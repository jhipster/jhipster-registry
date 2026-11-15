import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

import { SSHService } from './ssh.service';

@Component({
  selector: 'jhi-ssh',
  templateUrl: './ssh.html',
  imports: [FontAwesomeModule, NgbCollapse],
})
export default class SSH implements OnInit {
  readonly data = signal('');
  readonly showMore = signal(true);

  private readonly destroyRef = inject(DestroyRef);
  private readonly sshService = inject(SSHService);

  ngOnInit(): void {
    this.sshService
      .getSshPublicKey()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.data.set(response),
        error: () => this.data.set(''),
      });
  }
}
