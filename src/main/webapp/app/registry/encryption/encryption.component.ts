import { Component, OnDestroy } from '@angular/core';
import { EncryptionService } from './encryption.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-encryption',
  templateUrl: './encryption.component.html',
})
export class EncryptionComponent implements OnDestroy {
  showMore = true;
  textToEncrypt = '';
  encryptedText = '';
  result = '';
  private unsubscribe$ = new Subject();

  constructor(private encryptionService: EncryptionService) {}

  encrypt(): void {
    this.encryptionService
      .encrypt(this.textToEncrypt)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        response => {
          this.result = response;
          this.encryptedText = response;
        },
        () => {
          this.result = '';
        }
      );
  }

  decrypt(): void {
    this.encryptionService
      .decrypt(this.encryptedText.replace(/^{cipher}/, ''))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        response => {
          this.result = response;
          this.textToEncrypt = response;
        },
        () => {
          this.result = '';
        }
      );
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
