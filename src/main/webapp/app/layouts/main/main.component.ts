import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';

import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private $storageService: StateStorageService
  ) {}

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        const destinationEvent = event.state.root.firstChild!.children[0];
        const params = destinationEvent.params;
        const destinationData = destinationEvent.data;
        const destinationName = destinationEvent.url[0].path;
        const from = { name: this.router.url.slice(1) };
        const destination = { name: destinationName, data: destinationData };
        this.$storageService.storeDestinationState(destination, params, from);
      }
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'JHipster Registry';
    }
    this.titleService.setTitle(pageTitle);
  }
}
