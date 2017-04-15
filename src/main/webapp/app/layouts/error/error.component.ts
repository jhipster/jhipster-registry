import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'jhi-error',
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    errorMessage: string;
    error403: boolean;

    constructor(
        ) {
        }

    ngOnInit() {
    }
}
