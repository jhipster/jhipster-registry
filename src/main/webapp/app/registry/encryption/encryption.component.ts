import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEncryptionService } from './encryption.service';
import { ProfileService } from '../../layouts/profiles/profile.service';
import { JhiApplicationsService } from '../';
import { JhiRefreshService } from '../../shared/refresh/refresh.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-encryption',
    templateUrl: './encryption.component.html'
})
export class JhiEncryptionComponent implements OnInit, OnDestroy {
    showMore: boolean;
    textToEncrypt: string;
    encryptedText: string;
    result: string;

    constructor(private encryptionService: JhiEncryptionService) {
        this.showMore = true;
        this.textToEncrypt = '';
        this.encryptedText = '';
        this.result = '';
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    encrypt() {
        this.encryptionService.encrypt(this.textToEncrypt).subscribe((response) => {
            this.result = response;
            this.encryptedText = response;
        }, () => {
            this.result = '';
        });
    }

    decrypt() {
        this.encryptionService.decrypt(this.encryptedText).subscribe((response) => {
            this.result = response;
            this.textToEncrypt = response;
        }, () => {
            this.result = '';
        });
    }
}
