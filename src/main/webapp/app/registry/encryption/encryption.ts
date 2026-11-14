import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap/nav';

import { AlertError } from 'app/shared/alert';

import { EncryptionService } from './encryption.service';

@Component({
  selector: 'jhi-encryption',
  templateUrl: './encryption.html',
  imports: [AlertError, FontAwesomeModule, FormsModule, NgbCollapse, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet],
})
export default class Encryption {
  textToEncrypt = '';
  encryptedText = '';

  readonly showMore = signal(true);
  readonly result = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly encryptionService = inject(EncryptionService);

  encrypt(): void {
    this.encryptionService
      .encrypt(this.textToEncrypt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.result.set(response);
          this.encryptedText = response;
        },
        error: () => this.result.set(''),
      });
  }

  decrypt(): void {
    this.encryptionService
      .decrypt(this.encryptedText.replace(/^{cipher}/, ''))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.result.set(response);
          this.textToEncrypt = response;
        },
        error: () => this.result.set(''),
      });
  }
}
