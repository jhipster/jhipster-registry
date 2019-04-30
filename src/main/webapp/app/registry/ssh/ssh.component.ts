import { Component, OnInit } from '@angular/core';
import { JhiSSHService } from './ssh.service';

@Component({
    selector: 'jhi-applications',
    templateUrl: './ssh.component.html'
})
export class JhiSSHComponent implements OnInit {
    data: any;
    showMore: boolean;

    constructor(private sshService: JhiSSHService) {
        this.showMore = true;
    }

    ngOnInit() {
        this.sshService.getSshPublicKey().subscribe(response => {
            this.data = response;
        });
    }
}
