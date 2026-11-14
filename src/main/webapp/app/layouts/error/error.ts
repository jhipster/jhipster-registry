import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-error',

  templateUrl: './error.html',
})
export default class Error implements OnInit {
  readonly errorMessage = signal<string | undefined>(undefined);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      if (routeData.errorMessage) {
        this.errorMessage.set(routeData.errorMessage);
      }
    });
  }
}
