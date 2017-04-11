import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';

import { Title } from '@angular/platform-browser';
import { StateStorageService } from '../../shared';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit {

    constructor(private titleService: Title,
                private router: Router,
                private $storageService: StateStorageService) {}

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string;
        if (routeSnapshot.data && routeSnapshot.data['pageTitle']) {
            title = routeSnapshot.data['pageTitle'];
        } else {
            title = 'jhipsterRegistryApp';
        }
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.titleService.setTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
            if (event instanceof RoutesRecognized) {
                let params = {};
                let destinationData = {};
                let destinationName = '';
                let destinationEvent = event.state.root.firstChild.children[0];
                if (destinationEvent !== undefined) {
                    params = destinationEvent.params;
                    destinationData = destinationEvent.data;
                    destinationName = destinationEvent.url[0].path;
                }
                let from = {name: this.router.url.slice(1)};
                let destination = {name: destinationName, data: destinationData};
                this.$storageService.storeDestinationState(destination, params, from);
            }
        });
    }
}
