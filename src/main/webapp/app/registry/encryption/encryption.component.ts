import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEncryptionService } from './encryption.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-encryption',
  templateUrl: './encryption.component.html'
})
export class JhiEncryptionComponent implements OnInit, OnDestroy {
  showMore: boolean;
  textToEncrypt: string;
  encryptedText: string;
  result: string;

  private unSubscribe$ = new Subject();

  constructor(private encryptionService: JhiEncryptionService) {
    this.showMore = true;
    this.textToEncrypt = '';
    this.encryptedText = '';
    this.result = '';
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  encrypt() {
    this.encryptionService
      .encrypt(this.textToEncrypt)
      .pipe(takeUntil(this.unSubscribe$))
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

  decrypt() {
    this.encryptionService
      .decrypt(this.encryptedText.replace(/^{cipher}/, ''))
      .pipe(takeUntil(this.unSubscribe$))
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
}
